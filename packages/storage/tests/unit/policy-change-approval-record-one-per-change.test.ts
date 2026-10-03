import { describe, expect, it } from "vitest";

import type { Pool } from "pg";

import { ConflictError } from "@parmana/shared";
import type { PolicyChangeApprovalRecord } from "@parmana/shared";

import { MemoryPolicyChangeApprovalRecordRepository } from "../../src/memory/MemoryPolicyChangeApprovalRecordRepository.js";
import { SupabasePolicyChangeApprovalRecordRepository } from "../../src/supabase/SupabasePolicyChangeApprovalRecordRepository.js";

function record(id: string, pendingPolicyChangeId: string) {
  const at = new Date("2026-10-03T00:00:00Z");

  return {
    policyChangeApprovalRecordId: id,
    pendingPolicyChangeId,
    policyName: "customer-refund",
    policyVersion: "1.2.0",
    proposedBy: "maker",
    approvedBy: "checker",
    proposedAt: at,
    approvedAt: at,
    contentHashAfter: `hash-${id}`,
    signature: {
      algorithm: "ed25519",
      keyId: "default",
      value: "sig",
      signedAt: at,
    },
  } as PolicyChangeApprovalRecord;
}

/**
 * At most one approval record per pending policy change: the guard
 * that stops a second, concurrent approval before
 * PolicyChangeApprovalService writes the live policy.
 */
describe("one approval record per pending policy change", () => {
  it("memory: refuses a second record for the same pending change, even when both are created concurrently", async () => {
    const repository = new MemoryPolicyChangeApprovalRecordRepository();

    const results = await Promise.allSettled([
      repository.create(record("a", "change-1")),
      repository.create(record("b", "change-1")),
    ]);

    expect(results.map((result) => result.status).sort()).toEqual([
      "fulfilled",
      "rejected",
    ]);

    const failure = results.find((result) => result.status === "rejected");
    expect((failure as PromiseRejectedResult).reason).toBeInstanceOf(
      ConflictError,
    );

    await repository.create(record("c", "change-2"));
    expect(await repository.list()).toHaveLength(2);
  });

  it("postgres: maps a unique violation to ConflictError (409)", async () => {
    const pool = {
      async query() {
        throw Object.assign(new Error("duplicate key value"), {
          code: "23505",
        });
      },
    } as unknown as Pool;

    const repository = new SupabasePolicyChangeApprovalRecordRepository(pool);

    const error = await repository
      .create(record("a", "change-1"))
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ConflictError);
    expect((error as ConflictError).status).toBe(409);
  });

  it("postgres: rethrows any other database error unchanged", async () => {
    const original = Object.assign(new Error("connection reset"), {
      code: "08006",
    });
    const pool = {
      async query() {
        throw original;
      },
    } as unknown as Pool;

    const repository = new SupabasePolicyChangeApprovalRecordRepository(pool);

    await expect(repository.create(record("a", "change-1"))).rejects.toBe(
      original,
    );
  });
});
