import { Router } from "express";

import { application } from "../application.js";

const router = Router();



/**
 * GET /verify/:id
 *
 * Returns the latest Verification.
 */
router.get("/:id", async (req, res) => {
  try {
    const record = await application.getTrustRecord(req.params.id);

    if (!record) {
      return res.status(404).json({
        error: "Execution Trust Record not found.",
      });
    }

    const verification = record.verifications.at(-1);

    if (!verification) {
      return res.status(404).json({
        error: "Verification not found.",
      });
    }

    res.json(verification);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

export default router;
