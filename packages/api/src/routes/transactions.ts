import { Router } from "express";
import { application } from "../application.js";

const router = Router();



/**
 * GET /transactions
 *
 * Lists accepted Business Transactions.
 */
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page ?? 1);

    const pageSize = Number(req.query.pageSize ?? 25);

    const transactions = await application.listTransactions(page, pageSize);

    res.json(transactions);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

/**
 * GET /transactions/:id
 *
 * Returns a Business Transaction.
 */
router.get("/:id", async (req, res) => {
  try {
    const transaction = await application.getTransaction(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        error: "Business Transaction not found.",
      });
    }

    res.json(transaction);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

export default router;
