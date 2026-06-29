import { Router } from "express";
import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { application } from "../application.js";

const router = Router();

/**
 * GET /transactions
 *
 * Lists accepted Business Transactions.
 */
router.get(
  "/",
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = Number(
        req.query.page ?? 1,
      );

      const pageSize = Number(
        req.query.pageSize ?? 25,
      );

      const transactions =
        await application.listTransactions(
          page,
          pageSize,
        );

      res.json(transactions);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * GET /transactions/:id
 *
 * Returns a Business Transaction.
 */
router.get(
  "/:id",
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const transaction =
        await application.getTransaction(
          String(req.params.id),
        );

      if (!transaction) {
        return res.status(404).json({
          error:
            "Business Transaction not found.",
        });
      }

      res.json(transaction);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
