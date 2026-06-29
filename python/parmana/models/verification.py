"""
Verification model.
"""

from dataclasses import dataclass
from datetime import datetime
from enum import Enum


class VerificationStatus(str, Enum):
    VERIFIED = "VERIFIED"
    FAILED = "FAILED"


@dataclass(frozen=True, slots=True)
class Verification:
    """
    Immutable verification artifact.
    """

    verification_id: str

    business_transaction_id: str

    status: VerificationStatus

    message: str | None = None

    verified_at: datetime

    trust_record_hash: str