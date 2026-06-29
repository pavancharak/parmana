import { Router } from "express";
import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { application } from "../application.js";

const router = Router();

/**
 * GET /receipt/:id
 *
 * Returns the latest Receipt.
 */
router.get(
  "/:id",
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const record =
        await application.getTrustRecord(
          String(req.params.id),
        );

      if (!record) {
        return res.status(404).json({
          error:
            "Execution Trust Record not found.",
        });
      }

      const receipt =
        record.receipts.at(-1);

      if (!receipt) {
        return res.status(404).json({
          error: "Receipt not found.",
        });
      }

      res.json(receipt);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
