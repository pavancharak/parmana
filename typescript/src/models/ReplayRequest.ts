/**
 * Parmana TypeScript SDK
 *
 * Canonical ReplayRequest.
 */

import type {
  ExecutionTrustRecord,
} from "@parmana/shared";

/**
 * Request for deterministic replay.
 */
export interface ReplayRequest {
  /**
   * Execution Trust Record to replay.
   */
  readonly trustRecord: ExecutionTrustRecord;

  /**
   * Optional replay identifier.
   */
  readonly replayId?: string;
}