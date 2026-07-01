"""
Parmana Override Model.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class Override:
    """
    Human override.
    """

    override_id: str

    business_transaction_id: str

    authority_id: str

    reason: str

    approved_at: datetime