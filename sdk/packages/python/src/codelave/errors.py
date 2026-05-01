class CodelaveError(Exception):
    """Base exception for all Codelave SDK errors."""
    
    def __init__(self, message: str, status: int | None = None) -> None:
        super().__init__(message)
        self.status = status
