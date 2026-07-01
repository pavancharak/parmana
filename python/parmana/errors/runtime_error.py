from __future__ import annotations

from .api_error import ApiError


class RuntimeError(ApiError):
    """
    Raised when the Parmana Runtime
    returns an application error.
    """

    def __init__(
        self,
        message: str,
        *,
        request_id: str | None = None,
    ) -> None:
        super().__init__(
            message,
            code="RUNTIME_ERROR",
            request_id=request_id,
        )