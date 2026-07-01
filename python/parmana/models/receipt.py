from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class Receipt:
    """
    Cryptographic execution receipt.
    """

    receipt_id: str

    business_transaction_id: str

    trust_record_hash: str

    receipt_hash: str

    issued_at: datetime

    algorithm: str

    signature: str