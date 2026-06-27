import { describe, expect, it } from "vitest";

import { ExecutionTrustPipeline } from "../src/ExecutionTrustPipeline.js";
import { createRuntimeContext } from "./fixtures/runtime-context.js";

describe("ExecutionTrustPipeline", () => {

  it("should generate an Execution Trust Record", () => {

    const pipeline =
      new ExecutionTrustPipeline();

    const context =
      createRuntimeContext();

    const record =
      pipeline.execute(context);

    expect(record.businessTransactionId)
      .toBe(
        context.transaction.businessTransactionId
      );

    expect(record.transaction)
      .toBe(
        context.transaction
      );

    expect(record.executions)
      .toHaveLength(1);

    expect(
      record.executions[0].executionId
    ).toBe(
      context.execution!.executionId
    );

    expect(record.trustRecordId)
      .toBeTruthy();

    expect(record.createdAt)
      .toBeInstanceOf(Date);

    expect(record.updatedAt)
      .toBeInstanceOf(Date);

  });

  it("should produce the same business transaction", () => {

    const pipeline =
      new ExecutionTrustPipeline();

    const context =
      createRuntimeContext();

    const r1 =
      pipeline.execute(context);

    const r2 =
      pipeline.execute(context);

    expect(
      r1.businessTransactionId
    ).toBe(
      r2.businessTransactionId
    );

    expect(
      r1.transaction
    ).toEqual(
      r2.transaction
    );

    expect(
      r1.executions[0].executionId
    ).toBe(
      r2.executions[0].executionId
    );

  });

});