import { PolicyEngine } from "@parmana/policy";

const policy = {
  policyId: "vendor-payment",
  policyVersion: "1.0.0",
  schemaVersion: "1.0",
  signalsSchema: {},
  rules: [
    {
      id: "approve-low-risk",
      condition: "riskScore <= 50",
      action: "approve",
    },
    {
      id: "reject-high-risk",
      condition: "riskScore > 50",
      action: "reject",
    },
  ],
};

const signals = {
  amount: 2500,
  riskScore: 15,
};

const engine = new PolicyEngine();

const result = engine.evaluate(policy as any, signals);

console.log("==================================");
console.log("Parmana Example 02 - Policy Evaluation");
console.log("==================================");
console.log(JSON.stringify(result, null, 2));