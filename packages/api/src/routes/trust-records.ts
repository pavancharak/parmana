import { Router } from "express";

import {
  executionTrustRecordRepository,
} from "../repositories.js";

const router = Router();



router.get("/:id", async (req, res) => {

  const record =
    await executionTrustRecordRepository.findByTransactionId(
      req.params.id
    );

  if (!record) {

    return res.status(404).json({

      error:
        "Execution Trust Record not found.",

    });

  }

  res.json(record);

});

export default router;