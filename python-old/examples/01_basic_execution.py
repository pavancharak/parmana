"""
Parmana Python SDK

Example 01

Basic Execution

Demonstrates the complete Parmana execution trust flow.

Authority
    ↓
Authorization
    ↓
Intent
    ↓
BusinessTransaction
    ↓
Runtime.execute()
    ↓
Receipt
"""

from datetime import datetime
from uuid import uuid4

from parmana import ParmanaClient

from parmana.models.authority import Authority
from parmana.models.authorization import Authorization
from parmana.models.intent import Intent
from parmana.models.policy_reference import PolicyReference
from parmana.models.business_transaction import (
    BusinessTransaction,
)


def main() -> None:
    """
    Basic Parmana execution example.
    """

    authority = Authority(
        authority_id=str(uuid4()),
        authority_type="ORGANIZATION",
        authority_name="Acme Corporation",
        created_at=datetime.utcnow(),
        public_key="ed25519-public-key",
        signature_algorithm="Ed25519",
    )

    authorization = Authorization(
        authorization_id=str(uuid4()),
        authority_id=authority.authority_id,
        subject="robot-01",
        action="MOVE",
        resource="warehouse-zone-a",
        issued_at=datetime.utcnow(),
    )

    intent = Intent(
        intent_id=str(uuid4()),
        operation="MOVE",
        target="warehouse-zone-a",
        parameters={
            "speed": 1.5,
            "distance": 12,
        },
    )

    policy = PolicyReference(
        policy_name="warehouse-safety",
        policy_version="1.0.0",
    )

    transaction = BusinessTransaction(
        business_transaction_id=str(uuid4()),
        authority=authority,
        authorization=authorization,
        intent=intent,
        policy_reference=policy,
        created_at=datetime.utcnow(),
    )

    client = ParmanaClient()

    receipt = client.execute(transaction)

    print()

    print("===================================")
    print("Parmana Basic Execution")
    print("===================================")

    print(f"Transaction : {transaction.business_transaction_id}")
    print(f"Authority   : {authority.authority_name}")
    print(f"Intent      : {intent.operation}")
    print(f"Policy      : {policy.policy_name}")

    print()

    print("Execution Receipt")

    print("----------------------------")

    print(f"Receipt ID  : {receipt.receipt_id}")
    print(f"Algorithm   : {receipt.algorithm}")
    print(f"Issued At   : {receipt.issued_at}")

    print()

    print("Execution completed successfully.")

    print("===================================")


if __name__ == "__main__":
    main()