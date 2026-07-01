from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any

from .authority import Authority
from .authorization import Authorization
from .intent import Intent
from .policy import PolicyReference


@dataclass(frozen=True)
class BusinessTransactionMetadata:
    """
    Metadata describing the Business Transaction.
    """

    business_transaction_id: str

    correlation_id: str

    tenant_id: str | None

    source_system: str

    submitted_by: str

    submitted_at: datetime


@dataclass(frozen=True)
class BusinessTransaction:
    """
    Canonical Business Transaction.

    This is the primary input to the Parmana Runtime.
    """

    business_transaction_id: str

    metadata: BusinessTransactionMetadata

    authority: Authority

    authorization: Authorization

    intent: Intent

    policy: PolicyReference

    signals: dict[str, Any]

    status: str

    created_at: datetime