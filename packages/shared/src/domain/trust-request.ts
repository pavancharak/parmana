import { Authority } from "./authority.js";
import { Authorization } from "./authorization.js";
import { Intent } from "./intent.js";
import { TransactionMetadata } from "./metadata.js";
import { PolicyReference } from "./policy-reference.js";

/**
 * Parmana Trust Core
 *
 * Trust Request
 *
 * Immutable request submitted to Parmana for
 * policy evaluation and execution.
 *
 * A Trust Request has not yet been evaluated.
 */
export interface TrustRequest {
  readonly businessTransactionId: string;

  readonly metadata: TransactionMetadata;

  readonly authority: Authority;

  readonly authorization: Authorization;

  readonly intent: Intent;

  readonly policy: PolicyReference;

  readonly signals: Readonly<Record<string, unknown>>;
}