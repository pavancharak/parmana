"""
Execution Trust Record.
"""

from dataclasses import dataclass
from datetime import datetime

from .business_transaction import BusinessTransaction
from .execution import Execution
from .override import Override
from .receipt import Receipt
from .verification import Verification


@dataclass(frozen=True, slots=True)
class ExecutionTrustRecord:
    """
    Canonical immutable trust record.
    """

    trust_record_id: str

    business_transaction_id: str

    transaction: BusinessTransaction

    overrides: tuple[Override, ...]

    executions: tuple[Execution, ...]

    verifications: tuple[Verification, ...]

    receipts: tuple[Receipt, ...]

    trust_record_hash: str

    created_at: datetime

    updated_at: datetime