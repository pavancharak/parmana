import { Router } from "express";

import { application } from "../application.js";
const router = Router();



/**
 * Returns true when the Business Transaction ID
 * is a valid UUID.
 */
function isValidBusinessTransactionId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  );
}

/**
 * POST /receipt
 *
 * Generates a Receipt for a verified
 * Execution Trust Record.
 */
router.post("/", async (req, res) => {
  const { businessTransactionId } = req.body ?? {};

  //
  // Required field
  //
  if (!businessTransactionId) {
    return res.status(400).json({
      error: "businessTransactionId is required.",
    });
  }

  //
  // UUID validation
  //
  if (!isValidBusinessTransactionId(businessTransactionId)) {
    return res.status(400).json({
      error: "businessTransactionId must be a valid UUID.",
    });
  }

  try {
    const receipt = await application.generateReceipt(businessTransactionId);

    res.json(receipt);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

export default router;
