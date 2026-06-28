import { DecisionOutcome, normalizePolicy } from "@parmana/shared";
import { PolicyEngine } from "@parmana/policy";

import type { ReplayInput } from "./types/ReplayInput.js";
import type { ReplayResult } from "./types/ReplayResult.js";
import { toPolicySignals } from "./utils/to-policy-signals.js";

export class ReplayEngine {
  private readonly policyEngine = new PolicyEngine();

  public replay(input: ReplayInput): ReplayResult {
    const trustRecord = input.trustRecord;

    if (!trustRecord?.executions?.length) {
      throw new Error("Invalid trust record");
    }

    const execution = trustRecord.executions[0];

    if (!execution?.decision) {
      throw new Error("Missing decision");
    }

    const recordedDecision = execution.decision;

    //
    // Canonical replay inputs
    //
    const signals = toPolicySignals(input.transaction.signals);

    const policy = normalizePolicy(input.policy ?? {});

    //
    // Deterministic policy evaluation
    //
    const ledger = this.policyEngine.evaluate(
      policy,
      signals,
    );

    const replayedDecision = {
      decisionId: recordedDecision.decisionId,
      intentId: recordedDecision.intentId,
      policy: recordedDecision.policy,
      signals: recordedDecision.signals,

      outcome:
        ledger.action === "approve"
          ? DecisionOutcome.APPROVED
          : DecisionOutcome.REJECTED,

      reason: ledger.reason,

      // Preserve deterministic timestamp
      evaluatedAt: recordedDecision.evaluatedAt,
    };

    //
    // Temporary debug output
    //
    console.log("\n================ REPLAY DEBUG ================");
    console.log("Recorded Outcome :", recordedDecision.outcome);
    console.log("Replayed Outcome :", replayedDecision.outcome);
    console.log("Recorded Policy  :", recordedDecision.policy);
    console.log("Replay Policy    :", policy);
    console.log("Signals          :", signals);
    console.log("Ledger           :", ledger);

    const matches =
      recordedDecision.outcome ===
      replayedDecision.outcome;

    console.log("Matches          :", matches);
    console.log("=============================================\n");

    return {
      recordedDecision,
      replayedDecision,
      matches,

      // Preserve deterministic timestamp
      replayedAt: recordedDecision.evaluatedAt,
    };
  }
}