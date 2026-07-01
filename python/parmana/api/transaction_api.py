"""
Parmana Transaction API.

Retrieve Business Transactions.
"""

from __future__ import annotations

from parmana.config.transport import Transport
from parmana.models.business_transaction import BusinessTransaction


class TransactionApi:
    """
    Transaction API.

    Responsibilities
    ----------------
    - Retrieve Business Transactions
    - List Business Transactions

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
    ) -> BusinessTransaction:
        """
        Retrieve a Business Transaction.

        Parameters
        ----------
        business_transaction_id:
            Business Transaction identifier.

        Returns
        -------
        Business Transaction.
        """

        return self._transport.send(
            method="GET",
            path=f"/transactions/{business_transaction_id}",
            response_model=BusinessTransaction,
        )

    def list(
        self,
        *,
        page: int = 1,
        page_size: int = 25,
    ) -> list[BusinessTransaction]:
        """
        List Business Transactions.

        Parameters
        ----------
        page:
            Page number.

        page_size:
            Number of transactions per page.

        Returns
        -------
        List of Business Transactions.
        """

        return self._transport.send(
            method="GET",
            path=f"/transactions?page={page}&pageSize={page_size}",
            response_model=list[BusinessTransaction],
        )