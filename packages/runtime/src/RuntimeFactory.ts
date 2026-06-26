import { Runtime } from "./Runtime.js";
import { RuntimePipeline } from "./RuntimePipeline.js";

export class RuntimeFactory {
  static create() {
    // minimal safe pipeline (empty for now)
    const pipeline = new RuntimePipeline([]);

    return new Runtime(pipeline);
  }
}