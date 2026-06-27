export interface ReplayResult {
  executionOrder: string[];

  results: Array<{
    id: string;
    output: unknown;
  }>;

  hash: string;
}
