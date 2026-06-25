import { describe, it, expect } from "vitest";
import { ExecutionTrustPipeline } from "../src/ExecutionTrustPipeline.js";

describe("ExecutionTrustPipeline - Trust Guarantee", () => {
  it("should generate valid execution proof", () => {
    const pipeline = new ExecutionTrustPipeline();

    const result = pipeline.execute({
      executionId: "1",
      decisionId: "d1",
      intent: "transfer funds",
    });

    expect(result.trust.valid).toBe(true);
    expect(result.proof.executionId).toBe("1");
  });

  it("should produce deterministic execution structure", () => {
    const pipeline = new ExecutionTrustPipeline();

    const r1 = pipeline.execute({
      executionId: "x",
      decisionId: "d1",
      intent: "test",
    });

    const r2 = pipeline.execute({
      executionId: "x",
      decisionId: "d1",
      intent: "test",
    });

    expect(r1.proof.executionHash).toBe(r2.proof.executionHash);
  });
});