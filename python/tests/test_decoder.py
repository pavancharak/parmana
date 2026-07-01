from __future__ import annotations

from datetime import datetime

from parmana.models.trust_record import ExecutionTrustRecord
from parmana.serialization import decode


def test_decode_execution_trust_record():

    payload = {
        "trustRecordId": "tr-001",
        "businessTransactionId": "tx-001",
        "transaction": {
            "businessTransactionId": "tx-001",
            "metadata": {
                "businessTransactionId": "tx-001",
                "correlationId": "corr-001",
                "tenantId": None,
                "sourceSystem": "pytest",
                "submittedBy": "tester",
                "submittedAt": "2026-07-01T00:00:00Z",
            },
            "authority": {
                "authorityId": "authority-001",
                "authorityType": "SERVICE",
                "principalId": "pytest",
                "displayName": "PyTest",
                "issuedAt": "2026-07-01T00:00:00Z",
            },
            "authorization": {
                "authorizationId": "authz-001",
                "authorityId": "authority-001",
                "purpose": "Unit Test",
                "issuedAt": "2026-07-01T00:00:00Z",
            },
            "intent": {
                "intentId": "intent-001",
                "authorizationId": "authz-001",
                "action": "VendorPayment",
                "target": "vendor/1",
                "parameters": {
                    "amount": 100,
                },
                "createdAt": "2026-07-01T00:00:00Z",
            },
            "policy": {
                "name": "vendor-payment",
                "version": "1.0.0",
                "schemaVersion": "1.0.0",
            },
            "signals": {
                "approved": True,
            },
            "status": "RECEIVED",
            "createdAt": "2026-07-01T00:00:00Z",
        },
        "overrides": [],
        "executions": [],
        "verifications": [],
        "receipts": [],
        "trustRecordHash": "abc123",
        "createdAt": "2026-07-01T00:00:00Z",
        "updatedAt": "2026-07-01T00:00:00Z",
    }

    record = decode(
        payload,
        ExecutionTrustRecord,
    )

    assert isinstance(
        record,
        ExecutionTrustRecord,
    )

    assert record.trust_record_id == "tr-001"

    assert record.business_transaction_id == "tx-001"

    assert record.transaction.business_transaction_id == "tx-001"

    assert record.transaction.metadata.correlation_id == "corr-001"

    assert record.transaction.authority.authority_id == "authority-001"

    assert record.transaction.authorization.authorization_id == "authz-001"

    assert record.transaction.intent.intent_id == "intent-001"

    assert record.transaction.policy.schema_version == "1.0.0"

    assert record.trust_record_hash == "abc123"

    assert isinstance(
        record.created_at,
        datetime,
    )

    assert isinstance(
        record.updated_at,
        datetime,
    )