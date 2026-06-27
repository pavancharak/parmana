import { Router } from "express";

import { RuntimeFactory } from "@parmana/runtime";

import {
  businessTransactionRepository,
  executionTrustRecordRepository,
} from "../repositories.js";

const router = Router();

const application = RuntimeFactory.create(
  businessTransactionRepository,
  executionTrustRecordRepository,
);

/**
 * GET /receipt/:id
 *
 * Returns the latest Receipt.
 */
router.get("/:id", async (req, res) => {
  try {
    const record = await application.getTrustRecord(req.params.id);

    if (!record) {
      return res.status(404).json({
        error: "Execution Trust Record not found.",
      });
    }

    const receipt = record.receipts.at(-1);

    if (!receipt) {
      return res.status(404).json({
        error: "Receipt not found.",
      });
    }

    res.json(receipt);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

export default router;
