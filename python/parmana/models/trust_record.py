from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime

from .business_transaction import BusinessTransaction
from .execution import Execution
from .override import Override
from .receipt import Receipt
from .verification import Verification


@dataclass(frozen=True)
class ExecutionTrustRecord:
    """
    Canonical Execution Trust Record.
    """

    trust_record_id: str

    business_transaction_id: str

    transaction: BusinessTransaction

    overrides: list[Override]

    executions: list[Execution]

    verifications: list[Verification]

    receipts: list[Receipt]

    trust_record_hash: str

    created_at: datetime

    updated_at: datetime