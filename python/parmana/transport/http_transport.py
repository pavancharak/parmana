"""
Parmana HTTP Transport.

Canonical HTTP transport implementation for the Parmana Python SDK.
"""

from __future__ import annotations

from typing import Any, Type

import requests
from requests import Response
from requests.exceptions import RequestException

from parmana.config.transport import Transport
from parmana.errors.network_error import NetworkError
from parmana.errors.runtime_error import RuntimeError
from parmana.serialization import decode


class HttpTransport(Transport):
    """
    Canonical HTTP transport.

    Responsibilities
    ----------------
    - Send HTTP requests
    - Parse Runtime responses
    - Raise SDK exceptions
    - Decode Runtime responses into Parmana models
    """

    DEFAULT_TIMEOUT = 30

    def __init__(
        self,
        endpoint: str,
        *,
        timeout: int = DEFAULT_TIMEOUT,
        debug: bool = False,
    ) -> None:
        self._endpoint = endpoint.rstrip("/")
        self._timeout = timeout
        self._debug = debug

    @property
    def endpoint(self) -> str:
        """
        Parmana Runtime endpoint.
        """
        return self._endpoint

    def send(
        self,
        *,
        method: str,
        path: str,
        body: Any | None = None,
        response_model: Type | None = None,
    ) -> Any:
        """
        Send a request to the Parmana Runtime.
        """

        url = f"{self._endpoint}{path}"

        if self._debug:
            print("\n========== REQUEST ==========")
            print(f"METHOD : {method}")
            print(f"URL    : {url}")
            print(f"BODY   : {body}")
            print("=============================\n")

        try:
            response = requests.request(
                method=method,
                url=url,
                json=body,
                headers={
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                timeout=self._timeout,
            )

        except RequestException as exc:
            raise NetworkError() from exc

        payload = self._parse_response(response)

        if self._debug:
            print("\n========== RESPONSE ==========")
            print(payload)
            print("==============================\n")

        if response_model is None:
            return payload

        return decode(
            payload,
            response_model,
        )

    def _parse_response(
        self,
        response: Response,
    ) -> Any:
        """
        Parse Runtime response.
        """

        request_id = response.headers.get(
            "X-Request-Id",
        )

        #
        # Success
        #
        if response.ok:

            if not response.content:
                return None

            return response.json()

        #
        # Runtime Error
        #
        try:
            payload = response.json()

            message = (
                payload.get("error")
                or payload.get("message")
                or response.reason
            )

        except Exception:
            message = response.text or response.reason

        raise RuntimeError(
            message,
            request_id=request_id,
        )