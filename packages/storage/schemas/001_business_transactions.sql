CREATE TABLE business_transactions (

    business_transaction_id TEXT PRIMARY KEY,

    status TEXT NOT NULL,

    metadata_json JSONB NOT NULL,

    policy_json JSONB NOT NULL,

    signals_json JSONB NOT NULL,

    decision_json JSONB NOT NULL,

    created_at TIMESTAMPTZ NOT NULL

);