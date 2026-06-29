/**
 * Shared Package
 *
 * Canonical public API.
 */

export * from "./domain/index.js";
export * from "./repositories/index.js";
export * from "./config/index.js";
export * from "./errors/index.js";

export * from "./types/Json.js";

export type { ExecutionProof } from "./types/ExecutionProof.js";
export type { ExecutionTransaction } from "./types/ExecutionTransaction.js";
export type { Metadata } from "./types/Metadata.js";

export { normalizePolicy } from "./utils/normalize-policy.js";