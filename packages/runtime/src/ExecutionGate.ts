import { AuthorizationDecision } from "@parmana/shared";

import { RuntimeError } from "./errors/RuntimeError.js";

/**
 * Canonical execution enforcement gate.
 *
 * Every execution MUST pass through this gate.
 * If the AuthorizationDecision does not explicitly
 * approve execution, execution is rejected.
 */
export class ExecutionGate {
  /**
   * Returns true when execution is permitted.
   */
  public canExecute(
    decision: AuthorizationDecision,
  ): boolean {
    return decision.outcome === "APPROVE";
  }

  /**
   * Enforces the authorization decision.
   */
  public enforce(
    decision: AuthorizationDecision,
  ): void {
    if (this.canExecute(decision)) {
      return;
    }

    switch (decision.outcome) {
      case "REQUIRE_OVERRIDE":
        throw new RuntimeError(
          "Execution requires an approved human override.",
        );

      case "REJECT":
        throw new RuntimeError(
          `Execution rejected: ${decision.reason}`,
        );

      default:
        throw new RuntimeError(
          `Unknown authorization outcome: ${decision.outcome}`,
        );
    }
  }
}