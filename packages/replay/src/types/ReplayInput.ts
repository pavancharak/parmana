export interface ReplayInput {
  transactions: Array<{
    id: string;
    timestamp?: number;
    sequence?: number;

    payload: unknown;
  }>;

  context?: {
    deterministicSeed?: string;
  };
}
