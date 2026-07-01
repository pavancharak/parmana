from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class Authority:
    """
    Human or system authority responsible
    for authorizing execution.
    """

    authority_id: str

    authority_type: str

    principal_id: str

    display_name: str

    issued_at: datetime