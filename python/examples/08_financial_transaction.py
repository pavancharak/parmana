"""
Parmana Python SDK

Example 08

Financial Transaction

Demonstrates governance of a high-value payment.

Parmana does not move money.

Parmana ensures the payment was:

Authority
        ↓
Authorization
        ↓
Payment Intent
        ↓
AML Policy
        ↓
Fraud Policy
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
    # Bank Authority
    #
    authority = Authority(
        authority_id=str(uuid4()),
        authority_type="BANK",
        authority_name="Acme National Bank",
        created_at=datetime.utcnow(),
        public_key="bank-public-key",
        signature_algorithm="Ed25519",
    )

    #
    # Payment Authorization
    #
    authorization = Authorization(
        authorization_id=str(uuid4()),
        authority_id=authority.authority_id,
        subject="customer-1001",
        action="TRANSFER_FUNDS",
        resource="account-001",
        issued_at=datetime.utcnow(),
    )

    #
    # Payment Intent
    #
    intent = Intent(
        intent_id=str(uuid4()),
        operation="BANK_TRANSFER",
        target="beneficiary-account",
        parameters={
            "amount": 25000.00,
            "currency": "USD",
            "destination_bank": "Example Bank",
            "purpose": "Supplier Payment",
        },
    )

    #
    # Policy
    #
    policy = PolicyReference(
        policy_name="aml-fraud-policy",
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
            "kyc_verified": True,
            "aml_screening": "PASS",
            "fraud_score": 8,
            "sanctions_match": False,
        },
        outcome=DecisionOutcome.APPROVED,
        reason="Transaction satisfies AML and fraud policies.",
        evaluated_at=datetime.utcnow(),
    )

    #
    # Payment Execution
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
            "payment_network": "SWIFT",
            "settlement_reference": "SWIFT-20260001",
            "status": "SETTLED",
        },
    )

    verification = Verification(
        verification_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        status=VerificationStatus.VERIFIED,
        message="Payment execution verified.",
        verified_at=datetime.utcnow(),
        trust_record_hash="payment-trust-record",
    )

    receipt = Receipt(
        receipt_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        execution_id=execution.execution_id,
        trust_record_hash="payment-trust-record",
        receipt_hash="receipt-hash",
        signature="bank-signature",
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
        trust_record_hash="payment-trust-record",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    client = ParmanaClient()

    verification = client.verify(record)

    print()
    print("==========================================")
    print("Parmana Financial Transaction")
    print("==========================================")

    print(f"Bank             : {authority.authority_name}")
    print(f"Customer         : {authorization.subject}")
    print(f"Amount           : ${intent.parameters['amount']:,.2f}")
    print(f"Currency         : {intent.parameters['currency']}")

    print()

    print("Governance")

    print("--------------------------------")

    print(f"Policy           : {policy.policy_name}")
    print(f"Decision         : {decision.outcome.value}")
    print(f"Reason           : {decision.reason}")

    print()

    print("Execution")

    print("--------------------------------")

    print(f"Status           : {execution.status.value}")
    print(f"Settlement       : {execution.evidence['status']}")

    print()

    print("Verification")

    print("--------------------------------")

    print(f"Status           : {verification.status.value}")
    print(f"Receipt          : {receipt.receipt_id}")

    print()

    print(
        "Financial transaction executed with a "
        "complete execution trust chain."
    )

    print("==========================================")


if __name__ == "__main__":
    main()