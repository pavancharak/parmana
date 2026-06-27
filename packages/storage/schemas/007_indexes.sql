CREATE INDEX idx_execution_transaction
ON executions (
    business_transaction_id
);

CREATE INDEX idx_override_transaction
ON overrides (
    business_transaction_id
);

CREATE INDEX idx_verification_transaction
ON verifications (
    business_transaction_id
);

CREATE INDEX idx_receipt_transaction
ON receipts (
    business_transaction_id
);