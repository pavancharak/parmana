import { StorageEngine } from "@parmana/storage";

/**
 * Context for deterministic replay execution.
 */
export class ReplayContext {
  public readonly storage: StorageEngine;

  constructor(storage: StorageEngine = new StorageEngine()) {
    this.storage = storage;
    Object.freeze(this);
  }
}