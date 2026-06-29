import { Router } from "express";
import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { application } from "../application.js";

const router = Router();

/**
 * POST /replay
 *
 * Replays an existing Execution Trust Record.
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

      const replay =
        await application.replay(
          businessTransactionId,
        );

      res.json(replay);
    } catch (error) {
      next(error);
    }
  },
);

export default router;