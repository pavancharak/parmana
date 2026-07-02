import { describe, expect, it } from "vitest";

import { DefaultExecutionSystem } from "../src/DefaultExecutionSystem.js";

describe("DefaultExecutionSystem", () => {
  it("should execute a request successfully", async () => {
    const system = new DefaultExecutionSystem();

    const result = await system.execute({
      businessTransactionId: "tx-1",
      action: "PAY",
      target: "Vendor",
      parameters: {
        amount: 100,
      },
    });

    expect(result.success).toBe(true);
    expect(result.businessTransactionId).toBe("tx-1");
    expect(result.action).toBe("PAY");
    expect(result.target).toBe("Vendor");
  });
});