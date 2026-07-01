from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class Verification:
    """
    Verification produced by the Parmana Runtime.
    """

    verification_id: str

    business_transaction_id: str

    status: str

    message: str

    verified_at: datetime

    trust_record_hash: str