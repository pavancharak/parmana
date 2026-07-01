"""
Intent model.

Represents the requested operation before execution.
"""

from dataclasses import dataclass, field
from typing import Any


@dataclass(frozen=True, slots=True)
class Intent:
    """
    Intent submitted for execution.
    """

    intent_id: str

    operation: str

    target: str

    parameters: dict[str, Any] = field(default_factory=dict)

    version: str = "1.0"