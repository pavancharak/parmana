"""
Parmana Policy API.

Validate Runtime policies.
"""

from __future__ import annotations

from typing import Any

from parmana.config.transport import Transport


class PolicyApi:
    """
    Policy API.

    Responsibilities
    ----------------
    - Validate Runtime policies

    This API does NOT:
    - execute Business Transactions
    - verify trust records
    - replay executions
    - generate receipts
    """

    def __init__(
        self,
        transport: Transport,
    ) -> None:
        self._transport = transport

    def validate(
        self,
        policy: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Validate a Runtime policy.

        Parameters
        ----------
        policy:
            Policy document.

        Returns
        -------
        Policy validation result.
        """

        return self._transport.send(
            method="POST",
            path="/policies/validate",
            body=policy,
        )