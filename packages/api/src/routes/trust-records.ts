import { Router } from "express";
import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { application } from "../application.js";

const router = Router();

/**
 * GET /trust-records/:id
 *
 * Returns an Execution Trust Record.
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

      res.json(record);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
