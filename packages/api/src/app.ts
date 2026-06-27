import express from "express";

import executeRoutes from "./routes/execute.js";
import healthRoutes from "./routes/health.js";
import receiptRoutes from "./routes/receipt.js";
import receiptLatestRoutes from "./routes/receipt-get.js";
import transactionsRoutes from "./routes/transactions.js";
import trustRecordRoutes from "./routes/trust-records.js";
import verificationRoutes from "./routes/verify-get.js";
import verifyRoutes from "./routes/verify.js";
import versionRoutes from "./routes/version.js";
import replayRoutes from "./routes/replay.js";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "Parmana",
    status: "UP",
  });
});

/**
 * System
 */
app.use("/health", healthRoutes);

app.use("/version", versionRoutes);

/**
 * Execution
 */
app.use("/execute", executeRoutes);

/**
 * Verification
 */
app.use("/verify", verifyRoutes);

app.use("/verification", verificationRoutes);

/**
 * Receipts
 */
app.use("/receipt", receiptRoutes);

app.use("/receipt/latest", receiptLatestRoutes);

/**
 * Business Transactions
 */
app.use("/transactions", transactionsRoutes);

/**
 * Execution Trust Records
 */
app.use("/trust-records", trustRecordRoutes);
/**
 * Replay
 */
app.use("/replay", replayRoutes);

export default app;
