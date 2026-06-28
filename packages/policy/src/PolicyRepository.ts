import type { Policy } from "./types/Policy.js";

export interface PolicyRepository {
  load(
    name: string,
    version: string,
  ): Promise<Policy>;
}