import { Router } from "express";

import { RuntimeFactory } from "@parmana/runtime";

import {
  businessTransactionRepository,
  executionTrustRecordRepository,
} from "../repositories.js";

const router = Router();

const application =
  RuntimeFactory.create(
    businessTransactionRepository,
    executionTrustRecordRepository
  );

/**
 * POST /receipt
 *
 * Generates a Receipt for a verified
 * Execution Trust Record.
 */
router.post(
  "/",
  async (req, res) => {

    try {

      const {
        businessTransactionId,
      } = req.body;

      const receipt =
        await application.generateReceipt(
          businessTransactionId
        );

      res.json(
        receipt
      );

    } catch (err) {

      res.status(500).json({

        error:
          err instanceof Error
            ? err.message
            : "Unknown error",

      });

    }

  }
);

export default router;