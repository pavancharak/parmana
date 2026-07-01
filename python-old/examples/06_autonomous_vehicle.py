"""
Parmana Python SDK

Example 06

Autonomous Vehicle

Demonstrates execution governance for an
autonomous vehicle lane change.

Parmana governs the decision to execute.
It does not perform vehicle control.

Fleet Authority
        ↓
Vehicle Authorization
        ↓
Driving Intent
        ↓
Driving Policy
        ↓
Decision
        ↓
Execution
        ↓
Evidence
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
    # Fleet Authority
    #
    authority = Authority(
        authority_id=str(uuid4()),
        authority_type="FLEET_OPERATOR",
        authority_name="Acme Autonomous Mobility",
        created_at=datetime.utcnow(),
        public_key="fleet-public-key",
        signature_algorithm="Ed25519",
    )

    #
    # Vehicle Authorization
    #
    authorization = Authorization(
        authorization_id=str(uuid4()),
        authority_id=authority.authority_id,
        subject="vehicle-AV-001",
        action="CHANGE_LANE",
        resource="Highway-A1",
        issued_at=datetime.utcnow(),
    )

    #
    # Driving Intent
    #
    intent = Intent(
        intent_id=str(uuid4()),
        operation="CHANGE_LANE",
        target="Left Lane",
        parameters={
            "speed_kmh": 88,
            "direction": "LEFT",
            "reason": "Slow vehicle ahead",
        },
    )

    #
    # Driving Policy
    #
    policy = PolicyReference(
        policy_name="autonomous-driving-policy",
        policy_version="1.0.0",
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
    # Policy Decision
    #
    decision = Decision(
        decision_id=str(uuid4()),
        intent_id=intent.intent_id,
        policy=policy,
        signals={
            "left_lane_clear": True,
            "rear_vehicle_distance_m": 95,
            "weather": "CLEAR",
            "road_markings_visible": True,
        },
        outcome=DecisionOutcome.APPROVED,
        reason="Lane change satisfies driving policy.",
        evaluated_at=datetime.utcnow(),
    )

    #
    # Vehicle Execution
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
            "actual_speed_kmh": 87,
            "lane_change_duration_seconds": 3.1,
            "minimum_clearance_m": 41.2,
            "completed": True,
        },
    )

    #
    # Verification
    #
    verification = Verification(
        verification_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        status=VerificationStatus.VERIFIED,
        message="Execution verified successfully.",
        verified_at=datetime.utcnow(),
        trust_record_hash="vehicle-trust-record-hash",
    )

    #
    # Receipt
    #
    receipt = Receipt(
        receipt_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        execution_id=execution.execution_id,
        trust_record_hash="vehicle-trust-record-hash",
        receipt_hash="receipt-hash",
        signature="fleet-signature",
        algorithm="Ed25519",
        issued_at=datetime.utcnow(),
    )

    #
    # Trust Record
    #
    record = ExecutionTrustRecord(
        trust_record_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        transaction=transaction,
        overrides=(),
        executions=(execution,),
        verifications=(verification,),
        receipts=(receipt,),
        trust_record_hash="vehicle-trust-record-hash",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    client = ParmanaClient()

    print()
    print("==========================================")
    print("Parmana Autonomous Vehicle")
    print("==========================================")

    print(f"Vehicle          : {authorization.subject}")
    print(f"Operation        : {intent.operation}")
    print(f"Target           : {intent.target}")

    print()

    print("Decision")

    print("-----------------------------")

    print(f"Outcome          : {decision.outcome.value}")
    print(f"Reason           : {decision.reason}")

    print()

    print("Execution")

    print("-----------------------------")

    print(f"Status           : {execution.status.value}")
    print(f"Mode             : {execution.mode.value}")

    print()

    verification = client.verify(record)

    print("Verification")

    print("-----------------------------")

    print(f"Status           : {verification.status.value}")
    print(f"Verified At      : {verification.verified_at}")

    print()

    print(f"Trust Record     : {record.trust_record_id}")

    print()

    print(
        "Lane change completed with a fully "
        "verifiable execution trust chain."
    )

    print("==========================================")


if __name__ == "__main__":
    main()