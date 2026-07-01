"""
Execution Trust Receipt.
"""

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True, slots=True)
class Receipt:
    """
    Cryptographically verifiable receipt.
    """

    receipt_id: str

    business_transaction_id: str

    execution_id: str | None = None

    trust_record_hash: str

    receipt_hash: str

    signature: str

    algorithm: str

    issued_at: datetime