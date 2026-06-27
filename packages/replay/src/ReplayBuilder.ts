import { ReplayEngine } from "./ReplayEngine.js";

import type { ReplayContext } from "./types/ReplayContext.js";

export class ReplayBuilder {
  constructor(private readonly context: ReplayContext) {}

  build(): ReplayEngine {
    return new ReplayEngine();
  }
}
