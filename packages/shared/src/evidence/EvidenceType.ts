/**
 * Canonical evidence artifact types.
 */
export const EvidenceType = {
  SIGNAL: "SIGNAL",

  DECISION_RECORD: "DECISION_RECORD",

  POLICY_SNAPSHOT: "POLICY_SNAPSHOT",

  ATTESTATION: "ATTESTATION",

  RECEIPT: "RECEIPT",

  SIGNATURE: "SIGNATURE",

  HASH: "HASH",

  LEDGER_REFERENCE: "LEDGER_REFERENCE",

  METADATA: "METADATA",
} as const;

export type EvidenceType = (typeof EvidenceType)[keyof typeof EvidenceType];
