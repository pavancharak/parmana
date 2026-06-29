"""
Authorization model.

Represents an authorization issued by an Authority.
"""

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True, slots=True)
class Authorization:
    """
    Authorization issued by an Authority.
    """

    authorization_id: str

    authority_id: str

    subject: str

    action: str

    resource: str

    issued_at: datetime

    expires_at: datetime | None = None

    signature: str | None = None

    version: str = "1.0"