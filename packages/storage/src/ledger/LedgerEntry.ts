export interface LedgerEntry<T = unknown> {
  readonly id: string;
  readonly timestamp: number;
  readonly type: string;
  readonly payload: T;
}
