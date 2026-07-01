export interface Override {
  readonly overrideId: string;
  readonly businessTransactionId: string;
  readonly authorityId: string;
  readonly reason: string;
  readonly approvedAt: Date;
}