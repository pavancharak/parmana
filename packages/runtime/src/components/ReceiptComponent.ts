import { RuntimeContext } from "../context/RuntimeContext.js";
import type { RuntimeComponent } from "../RuntimeComponent.js";
import { ReceiptService } from "../services/receipt-service.js";

/**
 * Receipt Component.
 */
export class ReceiptComponent
  implements RuntimeComponent {

  constructor(
    private readonly receiptService: ReceiptService
  ) {
    Object.freeze(this);
  }

  public async execute(
    context: RuntimeContext
  ): Promise<RuntimeContext> {

    const receipt =
      await this.receiptService.generate(
        context.transaction.businessTransactionId
      );

    return {
      ...context,
      receipt,
    };
  }
}