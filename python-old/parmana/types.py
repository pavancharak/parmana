"""
Shared type aliases.
"""

from typing import Any

JsonValue = (
    None
    | bool
    | int
    | float
    | str
    | list[Any]
    | dict[str, Any]
)