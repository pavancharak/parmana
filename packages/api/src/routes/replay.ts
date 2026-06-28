import { Router } from "express";

import { application } from "../application.js";

const router = Router();



router.post("/", async (req, res) => {
  try {
    const { businessTransactionId } = req.body;

    const replay = await application.replay(businessTransactionId);

    res.json(replay);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

export default router;
