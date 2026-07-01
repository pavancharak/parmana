export interface Verification {
  readonly verificationId: string;
  readonly businessTransactionId: string;
  readonly status: string;
  readonly message: string;
  readonly verifiedAt: Date;
  readonly trustRecordHash: string;
}