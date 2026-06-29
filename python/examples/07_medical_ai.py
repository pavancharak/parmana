"""
Parmana Python SDK

Example 07

Medical AI

Demonstrates governance of an AI-assisted
clinical recommendation.

Parmana does not diagnose patients.

Parmana ensures the recommendation was:

Authority
        ↓
Authorization
        ↓
Clinical Intent
        ↓
Clinical Policy
        ↓
Decision
        ↓
Physician Approval
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
from parmana.models.override import Override
from parmana.models.policy_reference import PolicyReference
from parmana.models.receipt import Receipt
from parmana.models.verification import (
    Verification,
    VerificationStatus,
)


def main() -> None:

    #
    # Hospital Authority
    #
    authority = Authority(
        authority_id=str(uuid4()),
        authority_type="HOSPITAL",
        authority_name="City General Hospital",
        created_at=datetime.utcnow(),
        public_key="hospital-public-key",
        signature_algorithm="Ed25519",
    )

    #
    # Physician Authorization
    #
    authorization = Authorization(
        authorization_id=str(uuid4()),
        authority_id=authority.authority_id,
        subject="physician-001",
        action="APPROVE_TREATMENT",
        resource="patient-record",
        issued_at=datetime.utcnow(),
    )

    #
    # AI Recommendation
    #
    intent = Intent(
        intent_id=str(uuid4()),
        operation="RECOMMEND_TREATMENT",
        target="patient-12345",
        parameters={
            "diagnosis": "Community Acquired Pneumonia",
            "recommended_antibiotic": "Amoxicillin",
            "confidence": 0.96,
        },
    )

    #
    # Clinical Policy
    #
    policy = PolicyReference(
        policy_name="clinical-treatment-policy",
        policy_version="2026.1",
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
    # Policy Evaluation
    #
    decision = Decision(
        decision_id=str(uuid4()),
        intent_id=intent.intent_id,
        policy=policy,
        signals={
            "patient_age": 42,
            "drug_allergy": False,
            "renal_function": "NORMAL",
            "pregnant": False,
        },
        outcome=DecisionOutcome.APPROVED,
        reason="Recommendation complies with treatment policy.",
        evaluated_at=datetime.utcnow(),
    )

    #
    # Physician Approval
    #
    override = Override(
        override_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        approved_by="Dr. Sarah Johnson",
        reason="Treatment approved.",
        justification="Clinical review completed.",
        approved_at=datetime.utcnow(),
    )

    #
    # Execution
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
            "prescription_created": True,
            "ehr_updated": True,
            "physician_signed": True,
        },
    )

    verification = Verification(
        verification_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        status=VerificationStatus.VERIFIED,
        message="Clinical workflow verified.",
        verified_at=datetime.utcnow(),
        trust_record_hash="clinical-trust-record",
    )

    receipt = Receipt(
        receipt_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        execution_id=execution.execution_id,
        trust_record_hash="clinical-trust-record",
        receipt_hash="receipt-hash",
        signature="hospital-signature",
        algorithm="Ed25519",
        issued_at=datetime.utcnow(),
    )

    record = ExecutionTrustRecord(
        trust_record_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        transaction=transaction,
        overrides=(override,),
        executions=(execution,),
        verifications=(verification,),
        receipts=(receipt,),
        trust_record_hash="clinical-trust-record",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    client = ParmanaClient()

    verification = client.verify(record)

    print()
    print("==========================================")
    print("Parmana Medical AI")
    print("==========================================")

    print(f"Hospital          : {authority.authority_name}")
    print(f"Physician         : {override.approved_by}")
    print(f"Patient           : {intent.target}")

    print()

    print("AI Recommendation")

    print("-----------------------------")

    print(
        f"Diagnosis         : "
        f"{intent.parameters['diagnosis']}"
    )

    print(
        f"Treatment         : "
        f"{intent.parameters['recommended_antibiotic']}"
    )

    print(
        f"Confidence        : "
        f"{intent.parameters['confidence']}"
    )

    print()

    print("Governance")

    print("-----------------------------")

    print(f"Decision          : {decision.outcome.value}")
    print(f"Policy            : {policy.policy_name}")
    print(f"Physician Review  : Approved")

    print()

    print("Verification")

    print("-----------------------------")

    print(f"Status            : {verification.status.value}")

    print()

    print(
        "Clinical recommendation executed "
        "with a complete execution trust chain."
    )

    print("==========================================")


if __name__ == "__main__":
    main()