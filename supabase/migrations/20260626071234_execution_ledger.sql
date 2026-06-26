create table if not exists execution_ledger (
  execution_id text primary key,

  policy_id text not null,
  policy_version text not null,

  input jsonb not null,

  matched_rule_id text,
  action text,
  reason text,

  trace jsonb,

  hash text not null,

  timestamp bigint not null
);