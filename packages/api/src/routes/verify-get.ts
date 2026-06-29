import { Router } from "express";
import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { application } from "../application.js";

const router = Router();

/**
 * GET /verify/:id
 *
 * Returns the latest Verification.
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

      const verification =
        record.verifications.at(-1);

      if (!verification) {
        return res.status(404).json({
          error:
            "Verification not found.",
        });
      }

      res.json(verification);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
