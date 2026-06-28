import { Router } from "express";

import { application } from "../application.js";

const router = Router();



/**
 * GET /trust-records/:id
 *
 * Returns an Execution Trust Record.
 */
router.get("/:id", async (req, res) => {
  try {
    const record = await application.getTrustRecord(req.params.id);

    if (!record) {
      return res.status(404).json({
        error: "Execution Trust Record not found.",
      });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

export default router;
