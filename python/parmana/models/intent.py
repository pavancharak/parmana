from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any


@dataclass(frozen=True)
class Intent:
    """
    Business intent.
    """

    intent_id: str

    authorization_id: str

    action: str

    target: str

    parameters: dict[str, Any]

    created_at: datetime