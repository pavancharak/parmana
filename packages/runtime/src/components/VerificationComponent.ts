import { RuntimeContext } from "../context/RuntimeContext.js";
import type { RuntimeComponent } from "../RuntimeComponent.js";
import { VerificationService } from "../services/verification-service.js";

/**
 * Verification Component.
 */
export class VerificationComponent implements RuntimeComponent {
  constructor(private readonly verificationService: VerificationService) {
    Object.freeze(this);
  }

  public async execute(context: RuntimeContext): Promise<RuntimeContext> {
    const verification = await this.verificationService.verify(
      context.transaction.businessTransactionId,
    );

    return {
      ...context,
      verification,
    };
  }
}
