import { describe, expect, it } from "vitest";

import { RuntimeFactory } from "../src/RuntimeFactory.js";

import {
  MemoryBusinessTransactionRepository,
  MemoryExecutionTrustRecordRepository,
} from "@parmana/storage";

describe("RuntimeFactory", () => {
  it("creates a Runtime instance", () => {
    const runtime = RuntimeFactory.create(
      new MemoryBusinessTransactionRepository(),
      new MemoryExecutionTrustRecordRepository(),
    );

    expect(runtime).toBeDefined();
    expect(runtime).not.toBeNull();
  });
});
