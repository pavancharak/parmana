import type { ReplayContext } from "../types/ReplayContext.js";

import type { ReplayPlan } from "../types/ReplayPlan.js";

export class ReplayExecutor {
  execute(plan: ReplayPlan, _context: ReplayContext) {
    const executionOrder = plan.executionIds;

    return {
      executionIds: executionOrder,

      executionOrder,
    };
  }
}
