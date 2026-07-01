from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ReplayResult:
    """
    Result of replaying a Business Transaction.
    """

    business_transaction_id: str

    trust_record_hash: str

    verified: bool