import type { JsonValue } from "../types/Json.js";

/**
 * Business validation (RFC-0023).
 *
 * An agent proposes an action and the facts it rests on. Parmana keeps
 * two questions apart and answers each one itself:
 *
 * - Authority: may this caller perform this kind of action at all?
 * - Business validity: is this exact action valid for this exact
 *   business object, according to the system that owns the facts?
 *
 * A fact the agent proposed is never a business fact. For every signal
 * a policy declares a source for, Parmana asks that source and records
 * the answer as a TrustedSignal; the policy is evaluated on the trusted
 * value. Every status here is final for its request: nothing converts
 * AUTHORITY_UNCLEAR into AUTHORIZED, MISSING_DATA into VALID, or
 * INVALID into VALID.
 */

/**
 * Whether the caller may perform this kind of action. AUTHORIZED says
 * nothing about whether this particular action is valid or was
 * executed.
 */
export enum AuthorityStatus {
  AUTHORIZED = "AUTHORIZED",
  NOT_AUTHORIZED = "NOT_AUTHORIZED",
  AUTHORITY_UNCLEAR = "AUTHORITY_UNCLEAR",
  AUTHORITY_EXPIRED = "AUTHORITY_EXPIRED",
}

/**
 * Whether the business facts the policy needs were established by
 * their sources and support this exact action.
 *
 * NOT_EVALUATED means no validation ran: authority was not
 * established, the proposal did not describe the Intent, or the policy
 * declares no sourced facts. It is never VALID.
 */
export enum BusinessValidationStatus {
  VALID = "VALID",
  INVALID = "INVALID",
  MISSING_DATA = "MISSING_DATA",
  CONFLICTING_DATA = "CONFLICTING_DATA",
  SOURCE_UNAVAILABLE = "SOURCE_UNAVAILABLE",
  VALIDATION_EXPIRED = "VALIDATION_EXPIRED",
  NOT_EVALUATED = "NOT_EVALUATED",
}

/**
 * What happened to the action. EXECUTION_UNKNOWN is a release whose
 * outcome could not be established (for example a connector timeout
 * after the request was sent); it is never reported as failed.
 */
export enum ExecutionAssessmentStatus {
  EXECUTED = "EXECUTED",
  NOT_EXECUTED = "NOT_EXECUTED",
  EXECUTION_FAILED = "EXECUTION_FAILED",
  EXECUTION_UNKNOWN = "EXECUTION_UNKNOWN",
}

/**
 * How a TrustedSignal's content is bound. `digest` is the SHA-256 of
 * the canonical form of the signal without its integrityProof. It is
 * signed by Parmana as part of the record that carries the signal; it
 * proves what Parmana observed, not that the source said it.
 * `sourceProof` is whatever the source itself returned as proof of its
 * answer (a response signature, a checksum), verbatim, when it has one.
 */
export interface TrustedSignalIntegrityProof {
  readonly algorithm: "sha256";
  readonly digest: string;
  readonly sourceProof?: string;
}

/**
 * One business fact established by its source, bound to the exact
 * business object and the exact action it supports.
 */
export interface TrustedSignal {
  readonly signalId: string;

  /** The policy signal this fact supplies, such as "refundEligible". */
  readonly signalKey: string;

  /** The registered source that answered, such as "orders-system". */
  readonly source: string;

  /** Who answered, as the source reports it (an endpoint, an account). */
  readonly sourceIdentity: string;

  /** What was asked, such as "refund.eligible". */
  readonly claim: string;

  /** The business object the fact is about, read from the Intent. */
  readonly subject: string;

  /** Where in the Intent the subject was read, such as "parameters.orderId". */
  readonly subjectPath: string;

  readonly observedValue: JsonValue;
  readonly observedAt: Date;
  readonly validUntil: Date;

  /** The action and transaction this fact was established for. */
  readonly action: string;
  readonly businessTransactionId: string;

  readonly integrityProof: TrustedSignalIntegrityProof;
  readonly verificationStatus: "VERIFIED";
}

/**
 * Why one declared fact could not be established, or contradicted the
 * proposal.
 */
export interface BusinessValidationFailure {
  readonly signalKey: string;
  readonly status: BusinessValidationStatus;
  readonly reason: string;
}

export interface AuthorityAssessment {
  readonly status: AuthorityStatus;
  readonly reason: string;
}

export interface BusinessValidationAssessment {
  readonly status: BusinessValidationStatus;
  readonly reason: string;
  /** Facts established for this request, including any that passed when another failed. */
  readonly signals?: readonly TrustedSignal[];
  readonly failures?: readonly BusinessValidationFailure[];
}

export interface ExecutionAssessment {
  readonly status: ExecutionAssessmentStatus;
  readonly reason: string;
}

/**
 * The separate answers behind one Decision. `execution` is present on a
 * refused decision (always NOT_EXECUTED). For an approved decision the
 * Execution Trust Record's executions carry what happened.
 */
export interface DecisionAssessment {
  readonly authority: AuthorityAssessment;
  readonly businessValidation: BusinessValidationAssessment;
  readonly execution?: ExecutionAssessment;
}
