export interface Metadata {
  traceId: string;
  source: string;

  tags?: string[];
  createdAt: number;

  context?: Record<string, unknown>;
}
