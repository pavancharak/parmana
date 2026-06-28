export function normalizePolicy(policy: any) {
  return {
    policyId: policy?.policyId ?? "replay-policy",
    policyVersion: policy?.policyVersion ?? "1.0",
    schemaVersion: policy?.schemaVersion ?? "1.0",
    signalsSchema: policy?.signalsSchema ?? {},
    rules: Array.isArray(policy?.rules) ? policy.rules : [],
  };
}