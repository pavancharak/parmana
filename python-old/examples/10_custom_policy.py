"""
Parmana Python SDK

Example 10

Custom Policy

Demonstrates selecting an explicit policy version
for execution.

The BusinessTransaction specifies the PolicyReference.

Parmana Runtime loads exactly that policy.

It never discovers or selects policies automatically.

Authority
        ↓
Authorization
        ↓
Intent
        ↓
Business Transaction
        ↓
PolicyReference
        ↓
Policy Engine
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

from parmana import ParmanaClient

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


def main() -> None:

    #
    # Authority
    #

    authority = Authority(
        authority_id=str(uuid4()),
        authority_type="ENTERPRISE",
        authority_name="Acme Manufacturing",
        created_at=datetime.utcnow(),
        public_key="enterprise-public-key",
        signature_algorithm="Ed25519",
    )

    #
    # Authorization
    #

    authorization = Authorization(
        authorization_id=str(uuid4()),
        authority_id=authority.authority_id,
        subject="robot-arm-07",
        action="START_PRODUCTION",
        resource="assembly-line-3",
        issued_at=datetime.utcnow(),
    )

    #
    # Intent
    #

    intent = Intent(
        intent_id=str(uuid4()),
        operation="START_PRODUCTION",
        target="assembly-line-3",
        parameters={
            "batch": "BATCH-2026-001",
            "quantity": 500,
        },
    )

    #
    # Explicit Policy Reference
    #

    policy = PolicyReference(
        policy_name="manufacturing-production-policy",
        policy_version="2.3.1",
    )

    #
    # Business Transaction
    #

    transaction = BusinessTransaction(
        business_transaction_id=str(uuid4()),
        authority=authority,
        authorization=authorization,
        intent=intent,
        policy_reference=policy,
        created_at=datetime.utcnow(),
    )

    #
    # Runtime evaluates EXACTLY this policy.
    #

    decision = Decision(
        decision_id=str(uuid4()),
        intent_id=intent.intent_id,
        policy=policy,
        signals={
            "machine_ready": True,
            "operator_present": True,
            "quality_checks_passed": True,
            "emergency_stop": False,
        },
        outcome=DecisionOutcome.APPROVED,
        reason="Policy evaluation approved.",
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
            "policy_loaded": policy.policy_name,
            "policy_version": policy.policy_version,
            "production_started": True,
        },
    )

    verification = Verification(
        verification_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        status=VerificationStatus.VERIFIED,
        message="Execution verified.",
        verified_at=datetime.utcnow(),
        trust_record_hash="production-trust-record",
    )

    receipt = Receipt(
        receipt_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        execution_id=execution.execution_id,
        trust_record_hash="production-trust-record",
        receipt_hash="receipt-hash",
        signature="enterprise-signature",
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
        trust_record_hash="production-trust-record",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    client = ParmanaClient()

    verification = client.verify(record)

    print()
    print("==========================================")
    print("Parmana Custom Policy")
    print("==========================================")

    print(f"Authority        : {authority.authority_name}")
    print(f"Operation        : {intent.operation}")

    print()

    print("Policy")

    print("--------------------------------")

    print(f"Name             : {policy.policy_name}")
    print(f"Version          : {policy.policy_version}")

    print()

    print("Runtime")

    print("--------------------------------")

    print("Policy Selection : Explicit")
    print("Policy Discovery : Disabled")
    print("Decision         : APPROVED")

    print()

    print("Execution")

    print("--------------------------------")

    print(f"Status           : {execution.status.value}")
    print(f"Mode             : {execution.mode.value}")

    print()

    print("Verification")

    print("--------------------------------")

    print(f"Status           : {verification.status.value}")

    print()

    print("Canonical Guarantee")

    print("--------------------------------")

    print(
        "The BusinessTransaction specifies the "
        "PolicyReference."
    )

    print(
        "The Runtime loads exactly that policy."
    )

    print(
        "The Runtime never discovers or chooses "
        "another policy."
    )

    print()

    print(
        "Execution completed with a deterministic "
        "policy selection."
    )

    print("==========================================")


if __name__ == "__main__":
    main()