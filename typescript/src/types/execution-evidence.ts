/**
 * Execution evidence produced during execution.
 *
 * Parmana does not define the structure of execution
 * evidence. Evidence depends on the executing system.
 */
export type ExecutionEvidence = Readonly<Record<string, unknown>>;
