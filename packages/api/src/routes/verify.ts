import { Router } from "express";
import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { application } from "../application.js";

const router = Router();

/**
 * Returns true when the Business Transaction ID
 * is a valid UUID.
 */
function isValidBusinessTransactionId(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  );
}

/**
 * POST /verify
 *
 * Verifies an existing Execution Trust Record.
 */
router.post(
  "/",
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { businessTransactionId } =
        req.body ?? {};

      //
      // Required field
      //
      if (!businessTransactionId) {
        return res.status(400).json({
          error:
            "businessTransactionId is required.",
        });
      }

      //
      // UUID validation
      //
      if (
        !isValidBusinessTransactionId(
          businessTransactionId,
        )
      ) {
        return res.status(400).json({
          error:
            "businessTransactionId must be a valid UUID.",
        });
      }

      const verification =
        await application.verify(
          businessTransactionId,
        );

      res.json(verification);
    } catch (error) {
      next(error);
    }
  },
);

export default router;