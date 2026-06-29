/**
 * @parmana/policy
 *
 * Canonical public API.
 */

// -----------------------------------------------------------------------------
// Engine
// -----------------------------------------------------------------------------

export { PolicyEngine } from "./PolicyEngine.js";

// -----------------------------------------------------------------------------
// Routing & Registry
// -----------------------------------------------------------------------------

export { PolicyRegistry } from "./PolicyRegistry.js";
export { PolicyRouter } from "./PolicyRouter.js";

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

export { PolicyValidator } from "./PolicyValidator.js";
export { SignalValidator } from "./SignalValidator.js";

// -----------------------------------------------------------------------------
// Repositories
// -----------------------------------------------------------------------------

export type { PolicyRepository } from "./PolicyRepository.js";
export { FilePolicyRepository } from "./FilePolicyRepository.js";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type {
  Policy,
  PolicyCondition,
  PolicyInput,
  PolicyOutcome,
  PolicyRule,
} from "./types/Policy.js";

export type {
  PolicySignals,
} from "./types/PolicySignals.js";

export * from "./errors/index.js";