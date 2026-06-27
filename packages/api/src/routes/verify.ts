import { Router } from "express";

import { RuntimeFactory } from "@parmana/runtime";

import {
  businessTransactionRepository,
  executionTrustRecordRepository,
} from "../repositories.js";

const router = Router();

const application = RuntimeFactory.create(
  businessTransactionRepository,
  executionTrustRecordRepository
);

router.post("/", async (req, res) => {

  try {

    const result =
      await application.verify(
        req.body.businessTransactionId
      );

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