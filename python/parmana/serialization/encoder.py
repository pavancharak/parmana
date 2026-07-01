"""
Parmana Model Encoder.

Encode Parmana domain models into Runtime JSON.
"""

from __future__ import annotations

from dataclasses import asdict, is_dataclass
from datetime import datetime
from typing import Any


def _camel(name: str) -> str:
    """
    Convert snake_case to camelCase.
    """

    parts = name.split("_")

    return parts[0] + "".join(part.capitalize() for part in parts[1:])


def encode(value: Any) -> Any:
    """
    Encode Parmana models into Runtime JSON.
    """

    #
    # Dataclass
    #
    if is_dataclass(value):
        return encode(asdict(value))

    #
    # Dictionary
    #
    if isinstance(value, dict):
        return {
            _camel(key): encode(item)
            for key, item in value.items()
        }

    #
    # List
    #
    if isinstance(value, list):
        return [
            encode(item)
            for item in value
        ]

    #
    # datetime
    #
    if isinstance(value, datetime):
        return value.isoformat()

    #
    # Primitive
    #
    return value