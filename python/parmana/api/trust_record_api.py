"""
Parmana Trust Record API.

Retrieve Execution Trust Records.
"""

from __future__ import annotations

from parmana.config.transport import Transport
from parmana.models.trust_record import ExecutionTrustRecord


class TrustRecordApi:
    """
    Trust Record API.

    Responsibilities
    ----------------
    - Retrieve Execution Trust Records

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

    def get(
        self,
        business_transaction_id: str,
    ) -> ExecutionTrustRecord:
        """
        Retrieve an Execution Trust Record.

        Parameters
        ----------
        business_transaction_id:
            Business Transaction identifier.

        Returns
        -------
        Execution Trust Record.
        """

        return self._transport.send(
            method="GET",
            path=f"/trust-records/{business_transaction_id}",
            response_model=ExecutionTrustRecord,
        )