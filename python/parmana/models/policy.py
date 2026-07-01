from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class PolicyReference:
    """
    Versioned policy reference.
    """

    name: str

    version: str

    schema_version: str