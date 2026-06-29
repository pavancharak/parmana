"""
Override model.
"""

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True, slots=True)
class Override:
    """
    Authorized human override.
    """

    override_id: str

    business_transaction_id: str

    approved_by: str

    reason: str

    justification: str | None = None

    approved_at: datetime