"""
Example 02

Execute a Business Transaction.
"""

from __future__ import annotations

import json
from dataclasses import asdict
from datetime import UTC, datetime
from uuid import uuid4

from parmana import (
    Authority,
    Authorization,
    BusinessTransaction,
    BusinessTransactionMetadata,
    Intent,
    ParmanaClient,
    PolicyReference,
)


def main() -> None:
    client = ParmanaClient(
        endpoint="http://localhost:3000",
    )

    #
    # Generate a unique transaction ID for every execution.
    #
    transaction_id = str(uuid4())

    #
    # Use timezone-aware UTC timestamps.
    #
    now = datetime.now(UTC)

    transaction = BusinessTransaction(
        business_transaction_id=transaction_id,

        metadata=BusinessTransactionMetadata(
            business_transaction_id=transaction_id,
            correlation_id="demo-execution",
            tenant_id=None,
            source_system="python-sdk-example",
            submitted_by="sdk-demo",
            submitted_at=now,
        ),

        authority=Authority(
            authority_id="authority-001",
            authority_type="SERVICE",
            principal_id="python-sdk",
            display_name="Python SDK",
            issued_at=now,
        ),

        authorization=Authorization(
            authorization_id="authorization-001",
            authority_id="authority-001",
            purpose="Execute demo transaction",
            issued_at=now,
        ),

        intent=Intent(
            intent_id="intent-001",
            authorization_id="authorization-001",
            action="VendorPayment",
            target="vendor/V-100",
            parameters={
                "amount": 1000,
                "currency": "USD",
            },
            created_at=now,
        ),

        policy=PolicyReference(
            name="vendor-payment",
            version="1.0.0",
            schema_version="1.0.0",
        ),

        signals={
            "vendorVerified": True,
            "paymentApproved": True,
            "amount": 1000,
        },

        status="RECEIVED",

        created_at=now,
    )

    trust_record = client.execution.execute(transaction)

    print(
        json.dumps(
            asdict(trust_record),
            indent=2,
            default=str,
        )
    )


if __name__ == "__main__":
    main()