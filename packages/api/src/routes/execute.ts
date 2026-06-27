import { Router } from "express";

import { RuntimeFactory } from "@parmana/runtime";

import {
  businessTransactionRepository,
  executionTrustRecordRepository,
} from "../repositories.js";

const router = Router();

const runtime = RuntimeFactory.create(
  businessTransactionRepository,
  executionTrustRecordRepository
);

router.post("/", async (req, res) => {
  try {
    const result = await runtime.execute(req.body);

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : "Unknown error",
    });
  }
});

export default router;