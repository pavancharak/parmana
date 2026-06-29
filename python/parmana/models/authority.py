"""
Authority model.

Represents the authority responsible for issuing
authorizations within the Parmana trust chain.
"""

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True, slots=True)
class Authority:
    """
    Root authority in the execution trust chain.
    """

    authority_id: str
    authority_type: str
    authority_name: str

    created_at: datetime

    public_key: str

    signature_algorithm: str

    version: str = "1.0"