from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class Authorization:
    """
    Authorization granted by an Authority.
    """

    authorization_id: str

    authority_id: str

    purpose: str

    issued_at: datetime