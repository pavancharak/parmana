/**
 * Parmana SDK
 *
 * Canonical Domain Model
 *
 * The SDK does not define its own business domain model.
 * Instead, it re-exports the canonical shared model from
 * @parmana/shared.
 *
 * The shared package is the single source of truth for:
 * - Domain artifacts
 * - Repository contracts
 * - Shared configuration
 * - Shared errors
 * - Common types
 * - Shared utilities
 *
 * SDK consumers should import domain objects from this
 * module rather than depending directly on @parmana/shared.
 */

export * from "@parmana/shared";