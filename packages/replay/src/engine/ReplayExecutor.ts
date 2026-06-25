export class ReplayExecutor {
  execute(plan: any, context: any) {
    const executionOrder = plan.executionIds ?? [];

    return {
      executionIds: executionOrder,
      executionOrder
    };
  }
}