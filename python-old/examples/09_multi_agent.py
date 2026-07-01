"""
Parmana Python SDK

Example 09

Multi-Agent Coordination

Demonstrates governance of multiple AI agents
working together on a single Business Transaction.

Parmana does not orchestrate agents.

Parmana governs and records the execution trust chain.

Human Authority
        ↓
Authorization
        ↓
Shared Business Transaction
        ↓
Planner Agent
        ↓
Research Agent
        ↓
Execution Agent
        ↓
Policy Evaluation
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

    authority = Authority(
        authority_id=str(uuid4()),
        authority_type="ORGANIZATION",
        authority_name="Acme AI Operations",
        created_at=datetime.utcnow(),
        public_key="organization-public-key",
        signature_algorithm="Ed25519",
    )

    authorization = Authorization(
        authorization_id=str(uuid4()),
        authority_id=authority.authority_id,
        subject="multi-agent-system",
        action="EXECUTE_WORKFLOW",
        resource="customer-support",
        issued_at=datetime.utcnow(),
    )

    intent = Intent(
        intent_id=str(uuid4()),
        operation="HANDLE_CUSTOMER_REQUEST",
        target="support-ticket-12345",
        parameters={
            "customer_id": "CUST-1001",
            "priority": "HIGH",
        },
    )

    policy = PolicyReference(
        policy_name="multi-agent-governance-policy",
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
    # Individual agent outputs.
    #

    planner_agent = {
        "agent": "PlannerAgent",
        "result": "Workflow generated",
    }

    research_agent = {
        "agent": "ResearchAgent",
        "result": "Customer history retrieved",
    }

    execution_agent = {
        "agent": "ExecutionAgent",
        "result": "Support response prepared",
    }

    decision = Decision(
        decision_id=str(uuid4()),
        intent_id=intent.intent_id,
        policy=policy,
        signals={
            "planner_complete": True,
            "research_complete": True,
            "execution_ready": True,
        },
        outcome=DecisionOutcome.APPROVED,
        reason="All required agents completed successfully.",
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
            "planner": planner_agent,
            "research": research_agent,
            "execution": execution_agent,
        },
    )

    verification = Verification(
        verification_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        status=VerificationStatus.VERIFIED,
        message="Multi-agent execution verified.",
        verified_at=datetime.utcnow(),
        trust_record_hash="multi-agent-trust-record",
    )

    receipt = Receipt(
        receipt_id=str(uuid4()),
        business_transaction_id=transaction.business_transaction_id,
        execution_id=execution.execution_id,
        trust_record_hash="multi-agent-trust-record",
        receipt_hash="receipt-hash",
        signature="organization-signature",
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
        trust_record_hash="multi-agent-trust-record",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    client = ParmanaClient()

    verification = client.verify(record)

    print()
    print("==========================================")
    print("Parmana Multi-Agent Workflow")
    print("==========================================")

    print(f"Organization     : {authority.authority_name}")
    print(f"Workflow         : {intent.operation}")

    print()

    print("Agents")

    print("--------------------------------")

    print(f"Planner Agent    : {planner_agent['result']}")
    print(f"Research Agent   : {research_agent['result']}")
    print(f"Execution Agent  : {execution_agent['result']}")

    print()

    print("Governance")

    print("--------------------------------")

    print(f"Policy           : {policy.policy_name}")
    print(f"Decision         : {decision.outcome.value}")
    print(f"Reason           : {decision.reason}")

    print()

    print("Verification")

    print("--------------------------------")

    print(f"Status           : {verification.status.value}")
    print(f"Trust Record     : {record.trust_record_id}")

    print()

    print(
        "Multi-agent workflow completed with a "
        "single verifiable execution trust chain."
    )

    print("==========================================")


if __name__ == "__main__":
    main()