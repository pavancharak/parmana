from __future__ import annotations

from .api_error import ApiError


class NetworkError(ApiError):
    """
    Raised when the SDK cannot communicate
    with the Parmana Runtime.
    """

    def __init__(
        self,
        message: str = "Unable to communicate with the Parmana Runtime.",
        *,
        request_id: str | None = None,
    ) -> None:
        super().__init__(
            message,
            code="NETWORK_ERROR",
            request_id=request_id,
        )