import { ReplayEngine } from "./ReplayEngine.js";

export class ReplayBuilder {
  constructor(private context: any) {}

  build() {
    return new ReplayEngine();
  }
}