from __future__ import annotations


class ApiError(Exception):
    """
    Base exception for all Parmana SDK errors.
    """

    def __init__(
        self,
        message: str,
        *,
        code: str = "API_ERROR",
        request_id: str | None = None,
    ) -> None:
        super().__init__(message)

        self.code = code
        self.request_id = request_id