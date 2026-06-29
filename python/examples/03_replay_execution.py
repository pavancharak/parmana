"""
Parmana Python SDK

Example 03

Replay Execution

Demonstrates deterministic replay of an
Execution Trust Record.
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


def replay(record: ExecutionTrustRecord) -> None:
    """
    Placeholder replay implementation.

    Future versions of the SDK will invoke the
    Parmana Replay API to deterministically
    reconstruct execution.
    """

    print()
    print("Replay Summary")
    print("----------------------------")

    print(f"Trust Record : {record.trust_record_id}")
    print(f"Transaction  : {record.business_transaction_id}")
    print(f"Executions   : {len(record.executions)}")

    for execution in record.executions:
        print()
        print(f"Execution ID : {execution.execution_id}")
        print(f"Status       : {execution.status.value}")
        print(f"Decision     : {execution.decision.outcome.value}")
        print(f"Started At   : {execution.started_at}")
        print(f"Completed At : {execution.completed_at}")

    print()
    print("Replay completed successfully.")


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
        parameters={
            "speed": 1.5,
        },
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
        signals={
            "temperature": 22,
            "obstacle": False,
        },
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
        evidence={
            "distance": 12.4,
            "duration_seconds": 9.7,
        },
    )

    record = ExecutionTrustRecord(
        trust_record_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        transaction=transaction,
        overrides=(),
        executions=(execution,),
        verifications=(),
        receipts=(),
        trust_record_hash="abc123",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    print()
    print("===================================")
    print("Parmana Execution Replay")
    print("===================================")

    replay(record)

    print("===================================")


if __name__ == "__main__":
    main()