"""
Parmana Python SDK

Example 04

Audit Trust Chain

Demonstrates how an auditor can inspect the
complete Execution Trust Record.

Authority
        ↓
Authorization
        ↓
Intent
        ↓
Policy
        ↓
Decision
        ↓
Execution
        ↓
Verification
        ↓
Receipt
"""

from datetime import datetime
from uuid import uuid4

from parmana.models.authority import Authority
from parmana.models.authorization import Authorization
from parmana.models.business_transaction import BusinessTransaction
from parmana.models.decision import (
    Decision,
    DecisionOutcome,
)
from parmana.models.execution import (
    Execution,
    ExecutionMode,
    ExecutionStatus,
)
from parmana.models.execution_trust_record import (
    ExecutionTrustRecord,
)
from parmana.models.intent import Intent
from parmana.models.policy_reference import PolicyReference
from parmana.models.receipt import Receipt
from parmana.models.verification import (
    Verification,
    VerificationStatus,
)


def audit(record: ExecutionTrustRecord) -> None:
    """
    Placeholder audit implementation.
    """

    print()
    print("========== TRUST CHAIN ==========")

    print(f"Authority           : {record.transaction.authority.authority_name}")
    print(f"Authorization       : {record.transaction.authorization.authorization_id}")
    print(f"Intent              : {record.transaction.intent.operation}")

    print(
        f"Policy              : "
        f"{record.transaction.policy_reference.policy_name} "
        f"v{record.transaction.policy_reference.policy_version}"
    )

    print()

    print(f"Executions          : {len(record.executions)}")
    print(f"Verifications       : {len(record.verifications)}")
    print(f"Receipts            : {len(record.receipts)}")

    print()

    print(f"Trust Record Hash   : {record.trust_record_hash}")

    print()

    print("Trust chain audit completed successfully.")


def main() -> None:

    authority = Authority(
        authority_id=str(uuid4()),
        authority_type="ORGANIZATION",
        authority_name="Acme Corporation",
        created_at=datetime.utcnow(),
        public_key="public-key",
        signature_algorithm="Ed25519",
    )

    authorization = Authorization(
        authorization_id=str(uuid4()),
        authority_id=authority.authority_id,
        subject="robot-01",
        action="MOVE",
        resource="warehouse",
        issued_at=datetime.utcnow(),
    )

    intent = Intent(
        intent_id=str(uuid4()),
        operation="MOVE",
        target="warehouse-zone-a",
        parameters={},
    )

    policy = PolicyReference(
        policy_name="warehouse-policy",
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

    decision = Decision(
        decision_id=str(uuid4()),
        intent_id=intent.intent_id,
        policy=policy,
        signals={},
        outcome=DecisionOutcome.APPROVED,
        evaluated_at=datetime.utcnow(),
    )

    execution = Execution(
        execution_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        decision=decision,
        status=ExecutionStatus.COMPLETED,
        mode=ExecutionMode.SYNC,
        started_at=datetime.utcnow(),
        completed_at=datetime.utcnow(),
        evidence={},
    )

    verification = Verification(
        verification_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        status=VerificationStatus.VERIFIED,
        verified_at=datetime.utcnow(),
        trust_record_hash="abc123",
    )

    receipt = Receipt(
        receipt_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        execution_id=execution.execution_id,
        trust_record_hash="abc123",
        receipt_hash="receipt-hash",
        signature="signature",
        algorithm="Ed25519",
        issued_at=datetime.utcnow(),
    )

    record = ExecutionTrustRecord(
        trust_record_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        transaction=transaction,
        overrides=(),
        executions=(execution,),
        verifications=(verification,),
        receipts=(receipt,),
        trust_record_hash="abc123",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    print()
    print("===================================")
    print("Parmana Trust Chain Audit")
    print("===================================")

    audit(record)

    print("===================================")


if __name__ == "__main__":
    main()