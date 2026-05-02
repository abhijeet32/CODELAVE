from typing import TypedDict, Callable, Awaitable

class RunCodeResult(TypedDict):
    output: str
    stdout: str
    stderr: str
    duration: int

class SandboxStatus(TypedDict):
    id: str
    status: str

class FileInfo(TypedDict):
    name: str
    size: int | None

# Callback for streaming output line by line as it executes
# It can be a synchronous or asynchronous function
OutputCallback = Callable[[str], None | Awaitable[None]]
