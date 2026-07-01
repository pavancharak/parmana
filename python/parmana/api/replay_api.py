"""
Parmana Replay API.

Replay Business Transactions.
"""

from __future__ import annotations

from parmana.config.transport import Transport
from parmana.models.replay_result import ReplayResult


class ReplayApi:
    """
    Replay API.

    Responsibilities
    ----------------
    - Replay Business Transactions
    - Verify deterministic execution

    This API does NOT:
    - execute Business Transactions
    - verify trust records
    - generate receipts
    - validate policies
    """

    def __init__(
        self,
        transport: Transport,
    ) -> None:
        self._transport = transport

    def replay(
        self,
        business_transaction_id: str,
    ) -> ReplayResult:
        """
        Replay a Business Transaction.

        Parameters
        ----------
        business_transaction_id:
            Business Transaction identifier.

        Returns
        -------
        Replay Result.
        """

        return self._transport.send(
            method="POST",
            path="/replay",
            body={
                "businessTransactionId": business_transaction_id,
            },
            response_model=ReplayResult,
        )