import asyncio
import aiohttp
from typing import Any
from .errors import CodelaveError

async def fetch_with_retry(
    session: aiohttp.ClientSession,
    method: str,
    url: str,
    retries: int = 2,
    **kwargs: Any
) -> aiohttp.ClientResponse:
    """
    Fetch wrapper that adds network retry logic.
    Note: Only network failures are retried. HTTP error responses are returned immediately.
    """
    for i in range(retries + 1):
        try:
            response = await session.request(method, url, **kwargs)
            return response
        except aiohttp.ClientError as error:
            if i == retries:
                raise CodelaveError(f"Network error: {str(error)}") from error
            # Exponential backoff
            await asyncio.sleep(2 ** i)
    
    raise CodelaveError("Unreachable")
