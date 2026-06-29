"""
Execution model.
"""

from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Any

from .decision import Decision
from .execution_evidence import ExecutionEvidence


class ExecutionStatus(str, Enum):
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class ExecutionMode(str, Enum):
    SYNC = "SYNC"
    ASYNC = "ASYNC"


@dataclass(frozen=True, slots=True)
class Execution:
    """
    Immutable execution artifact.
    """

    execution_id: str

    business_transaction_id: str

    decision: Decision

    status: ExecutionStatus

    mode: ExecutionMode

    started_at: datetime

    completed_at: datetime | None = None

    evidence: ExecutionEvidence | None = None

    metadata: dict[str, Any] | None = None