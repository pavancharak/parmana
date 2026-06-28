export interface RuntimeContainerDeps {
  executionService: any;
  trustRecordService: any;
  verificationService: any;
  receiptService: any;
}

/**
 * RuntimeContainer
 *
 * Dependency container for Runtime layer.
 * Keeps service wiring explicit and deterministic.
 */
export class RuntimeContainer {
  private readonly executionService: any;
  private readonly trustRecordService: any;
  private readonly verificationService: any;
  private readonly receiptService: any;

  constructor(deps: RuntimeContainerDeps) {
    this.executionService = deps.executionService;
    this.trustRecordService = deps.trustRecordService;
    this.verificationService = deps.verificationService;
    this.receiptService = deps.receiptService;

    Object.freeze(this);
  }

  /**
   * Execution service accessor
   */
  public getExecutionService() {
    return this.executionService;
  }

  /**
   * Trust record service accessor
   */
  public getTrustRecordService() {
    return this.trustRecordService;
  }

  /**
   * Verification service accessor
   */
  public getVerificationService() {
    return this.verificationService;
  }

  /**
   * Receipt service accessor
   */
  public getReceiptService() {
    return this.receiptService;
  }
}