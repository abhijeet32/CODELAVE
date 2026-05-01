import os
import asyncio
import aiohttp
from typing import Optional, Dict, List, cast
import logging

from .errors import CodelaveError
from .types import RunCodeResult, SandboxStatus, FileInfo, OutputCallback
from .utils import fetch_with_retry

DEFAULT_BASE_URL = "https://api.codelave.com"
logger = logging.getLogger(__name__)

class Sandbox:
    """
    Represents an isolated sandbox environment in the Codelave platform.
    Use `Sandbox.create()` to initialize a new sandbox.
    """
    
    def __init__(self, id: str, api_key: str, base_url: str) -> None:
        self.id = id
        self._api_key = api_key
        self._base_url = base_url.rstrip("/")
        self._session = aiohttp.ClientSession()

    @property
    def _headers(self) -> Dict[str, str]:
        return {
            "X-API-Key": self._api_key,
            "Authorization": f"Bearer {self._api_key}",
        }

    @classmethod
    async def create(
        cls, 
        api_key: str, 
        template: str, 
        timeout_minutes: Optional[int] = None,
        base_url: Optional[str] = None
    ) -> "Sandbox":
        """
        Creates a new isolated sandbox environment.
        """
        if not api_key:
            raise CodelaveError("API key is required")

        url_base = base_url or os.environ.get("CODELAVE_BASE_URL") or DEFAULT_BASE_URL
        url = f"{url_base.rstrip('/')}/sandbox"
        
        async with aiohttp.ClientSession() as session:
            payload = {"template": template}
            if timeout_minutes is not None:
                payload["timeoutMinutes"] = timeout_minutes
                
            headers = {
                "Content-Type": "application/json",
                "X-API-Key": api_key,
                "Authorization": f"Bearer {api_key}"
            }
            
            response = await fetch_with_retry(
                session, 
                "POST", 
                url, 
                headers=headers, 
                json=payload
            )
            
            if not response.ok:
                if response.status in (401, 403):
                    raise CodelaveError("Authentication failed. Please check your API key.", response.status)
                text = await response.text()
                raise CodelaveError(f"Failed to create sandbox: {response.status} {text}", response.status)
                
            data = await response.json()
            return cls(data["id"], api_key, url_base)

    async def run_code(
        self, 
        code: str, 
        on_output: Optional[OutputCallback] = None
    ) -> RunCodeResult:
        """
        Runs code inside the sandbox.
        """
        url = f"{self._base_url}/sandbox/{self.id}/execute"
        ws_connection = None
        
        if on_output:
            ws_url = f"{self._base_url}/sandbox/{self.id}/stream"
            ws_url = ws_url.replace("https://", "wss://").replace("http://", "ws://")
            
            try:
                ws_connection = await self._session.ws_connect(
                    ws_url, 
                    headers=self._headers
                )
                
                async def listen_to_ws() -> None:
                    try:
                        async for msg in ws_connection: # type: ignore
                            if msg.type == aiohttp.WSMsgType.TEXT:
                                res = on_output(msg.data)
                                if asyncio.iscoroutine(res):
                                    await res
                    except Exception as e:
                        logger.warning(f"Error reading from WebSocket: {e}")
                        
                asyncio.create_task(listen_to_ws())
                
            except Exception as e:
                logger.warning(f"Failed to connect to streaming WebSocket. Output will not be streamed: {e}")
                if ws_connection:
                    await ws_connection.close()
                ws_connection = None

        try:
            headers = {**self._headers, "Content-Type": "application/json"}
            response = await fetch_with_retry(
                self._session, 
                "POST", 
                url, 
                headers=headers, 
                json={"code": code}
            )

            if not response.ok:
                if response.status in (401, 403):
                    raise CodelaveError("Authentication failed. Please check your API key.", response.status)
                if response.status in (408, 504):
                    raise CodelaveError("Execution timed out after exceeding the limit.", response.status)
                text = await response.text()
                raise CodelaveError(f"Execution failed: {response.status} {text}", response.status)

            data = await response.json()
            return cast(RunCodeResult, {
                "output": data.get("output", data.get("stdout", "")),
                "stdout": data.get("stdout", ""),
                "stderr": data.get("stderr", ""),
                "duration": data.get("duration", 0),
            })
        finally:
            if ws_connection:
                await ws_connection.close()

    async def upload_file(self, local_path: str, remote_path: str) -> None:
        """
        Uploads a local file into the sandbox.
        """
        url = f"{self._base_url}/sandbox/{self.id}/files/upload"
        
        with open(local_path, "rb") as f:
            data = aiohttp.FormData()
            data.add_field('file', f, filename=remote_path)
            
            response = await fetch_with_retry(
                self._session,
                "POST",
                url,
                headers=self._headers,
                data=data
            )
            
            if not response.ok:
                text = await response.text()
                raise CodelaveError(f"Failed to upload file: {response.status} {text}", response.status)

    async def download_file(self, remote_path: str, local_path: str) -> None:
        """
        Downloads a file from the sandbox to the local filesystem.
        """
        from urllib.parse import quote
        encoded_path = quote(remote_path)
        url = f"{self._base_url}/sandbox/{self.id}/files/{encoded_path}"
        
        response = await fetch_with_retry(
            self._session,
            "GET",
            url,
            headers=self._headers
        )
        
        if not response.ok:
            text = await response.text()
            raise CodelaveError(f"Failed to download file: {response.status} {text}", response.status)
            
        content = await response.read()
        with open(local_path, "wb") as f:
            f.write(content)

    async def list_files(self) -> List[FileInfo]:
        """
        Lists all files in the sandbox.
        """
        url = f"{self._base_url}/sandbox/{self.id}/files"
        
        response = await fetch_with_retry(
            self._session,
            "GET",
            url,
            headers=self._headers
        )
        
        if not response.ok:
            text = await response.text()
            raise CodelaveError(f"Failed to list files: {response.status} {text}", response.status)
            
        return cast(List[FileInfo], await response.json())

    async def get_status(self) -> SandboxStatus:
        """
        Gets the current status of the sandbox.
        """
        url = f"{self._base_url}/sandbox/{self.id}"
        
        response = await fetch_with_retry(
            self._session,
            "GET",
            url,
            headers=self._headers
        )
        
        if not response.ok:
            text = await response.text()
            raise CodelaveError(f"Failed to get status: {response.status} {text}", response.status)
            
        return cast(SandboxStatus, await response.json())

    async def destroy(self) -> None:
        """
        Destroys the sandbox environment manually.
        """
        url = f"{self._base_url}/sandbox/{self.id}"
        
        response = await fetch_with_retry(
            self._session,
            "DELETE",
            url,
            headers=self._headers
        )
        
        if not response.ok:
            text = await response.text()
            raise CodelaveError(f"Failed to destroy sandbox: {response.status} {text}", response.status)
            
        await self._session.close()

    async def __aenter__(self) -> "Sandbox":
        return self

    async def __aexit__(self, exc_type: Any, exc_val: Any, exc_tb: Any) -> None:
        try:
            await self.destroy()
        except Exception:
            # Do not log sensitive info, just suppress errors on cleanup
            logger.error("Failed to cleanly dispose sandbox on exit")
