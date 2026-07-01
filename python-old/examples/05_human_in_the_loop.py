"""
Parmana Python SDK

Example 05

Human in the Loop

Demonstrates an authorized human override after a
policy rejects an execution request.

Authority
        ↓
Authorization
        ↓
Intent
        ↓
Policy Evaluation
        ↓
REJECTED
        ↓
Human Override
        ↓
Approved
        ↓
Execution
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
from parmana.models.override import Override
from parmana.models.policy_reference import PolicyReference


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
        subject="warehouse-robot-01",
        action="ENTER",
        resource="restricted-zone",
        issued_at=datetime.utcnow(),
    )

    intent = Intent(
        intent_id=str(uuid4()),
        operation="ENTER_RESTRICTED_ZONE",
        target="warehouse-zone-b",
        parameters={
            "reason": "Emergency maintenance",
        },
    )

    policy = PolicyReference(
        policy_name="warehouse-safety-policy",
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

    #
    # Initial policy decision.
    #
    decision = Decision(
        decision_id=str(uuid4()),
        intent_id=intent.intent_id,
        policy=policy,
        signals={
            "restricted_zone": True,
            "emergency": False,
        },
        outcome=DecisionOutcome.REJECTED,
        reason="Restricted zone access denied.",
        evaluated_at=datetime.utcnow(),
    )

    print()
    print("========================================")
    print("Initial Policy Decision")
    print("========================================")

    print(f"Decision : {decision.outcome.value}")
    print(f"Reason   : {decision.reason}")

    #
    # Human override.
    #
    override = Override(
        override_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        approved_by="Operations Manager",
        reason="Emergency maintenance approved.",
        justification="Critical repair required.",
        approved_at=datetime.utcnow(),
    )

    print()
    print("Human Override Approved")
    print("-------------------------------")

    print(f"Approved By : {override.approved_by}")
    print(f"Reason      : {override.reason}")

    #
    # Execution after override.
    #
    execution = Execution(
        execution_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        decision=decision,
        status=ExecutionStatus.COMPLETED,
        mode=ExecutionMode.SYNC,
        started_at=datetime.utcnow(),
        completed_at=datetime.utcnow(),
        evidence={
            "override": True,
            "operator": override.approved_by,
            "result": "Access Granted",
        },
    )

    record = ExecutionTrustRecord(
        trust_record_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        transaction=transaction,
        overrides=(override,),
        executions=(execution,),
        verifications=(),
        receipts=(),
        trust_record_hash="trust-record-hash",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    print()
    print("========================================")
    print("Execution Trust Record")
    print("========================================")

    print(f"Transaction : {record.business_transaction_id}")
    print(f"Overrides   : {len(record.overrides)}")
    print(f"Executions  : {len(record.executions)}")

    print()

    print("Human-in-the-loop execution completed.")

    print("========================================")


if __name__ == "__main__":
    main()