"""
Parmana Receipt API.

Generate cryptographic execution receipts.
"""

from __future__ import annotations

from parmana.config.transport import Transport
from parmana.models.receipt import Receipt


class ReceiptApi:
    """
    Receipt API.

    Responsibilities
    ----------------
    - Generate execution receipts

    This API does NOT:
    - execute Business Transactions
    - replay executions
    - verify trust records
    - validate policies
    """

    def __init__(
        self,
        transport: Transport,
    ) -> None:
        self._transport = transport

    def generate(
        self,
        business_transaction_id: str,
    ) -> Receipt:
        """
        Generate an execution receipt.

        Parameters
        ----------
        business_transaction_id:
            Business Transaction identifier.

        Returns
        -------
        Receipt.
        """

        return self._transport.send(
    method="POST",
    path="/receipt",
    body={
        "businessTransactionId": business_transaction_id,
    },
    response_model=Receipt,
)