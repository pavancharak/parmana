/**
 * @parmana/verification
 *
 * Canonical public API.
 */

// -----------------------------------------------------------------------------
// Core
// -----------------------------------------------------------------------------

export * from "./VerificationEngine.js";
export * from "./VerificationBuilder.js";

// -----------------------------------------------------------------------------
// Pipeline
// -----------------------------------------------------------------------------

export * from "./VerificationPipeline.js";
export * from "./VerificationComponent.js";

// -----------------------------------------------------------------------------
// Context
// -----------------------------------------------------------------------------

export * from "./context/VerificationContext.js";

// -----------------------------------------------------------------------------
// Verification Stages
// -----------------------------------------------------------------------------

export * from "./stages/IntegrityStage.js";
export * from "./stages/AuthorityVerificationStage.js";
export * from "./stages/AuthorizationVerificationStage.js";
export * from "./stages/IntentVerificationStage.js";
export * from "./stages/EvidenceVerificationStage.js";
export * from "./stages/SignatureVerificationStage.js";

// -----------------------------------------------------------------------------
// Errors
// -----------------------------------------------------------------------------

export * from "./errors/VerificationError.js";