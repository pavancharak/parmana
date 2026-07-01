"""
Parmana Verification API.

Verify Execution Trust Records.
"""

from __future__ import annotations

from parmana.config.transport import Transport
from parmana.models.verification import Verification


class VerificationApi:
    """
    Verification API.

    Responsibilities
    ----------------
    - Verify Execution Trust Records

    This API does NOT:
    - execute Business Transactions
    - replay executions
    - generate receipts
    - validate policies
    """

    def __init__(
        self,
        transport: Transport,
    ) -> None:
        self._transport = transport

    def verify(
        self,
        business_transaction_id: str,
    ) -> Verification:
        """
        Verify an Execution Trust Record.

        Parameters
        ----------
        business_transaction_id:
            Business Transaction identifier.

        Returns
        -------
        Verification.
        """

        return self._transport.send(
    method="POST",
    path="/verify",
    body={
        "businessTransactionId": business_transaction_id,
    },
    response_model=Verification,
)