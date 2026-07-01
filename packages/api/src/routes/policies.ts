import { Router } from "express";
import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  policyRepository,
} from "../application.js";

const router = Router();

/**
 * POST /policies/validate
 *
 * Validates that a policy exists and is readable.
 */
router.post(
  "/validate",
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {
        policyId,
        policyVersion,
      } = req.body ?? {};

      if (
        typeof policyId !== "string" ||
        policyId.length === 0
      ) {
        return res.status(400).json({
          valid: false,
          errors: [
            "policyId is required.",
          ],
        });
      }

      if (
        typeof policyVersion !== "string" ||
        policyVersion.length === 0
      ) {
        return res.status(400).json({
          valid: false,
          errors: [
            "policyVersion is required.",
          ],
        });
      }

      await policyRepository.load(
        policyId,
        policyVersion,
      );

      return res.json({
        valid: true,
        errors: [],
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({
          valid: false,
          errors: [
            error.message,
          ],
        });
      }

      next(error);
    }
  },
);

export default router;