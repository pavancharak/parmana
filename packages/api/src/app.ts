import express from "express";
import trustRecordRoutes
  from "./routes/trust-records.js";
import executeRoutes from "./routes/execute.js";
import healthRoutes from "./routes/health.js";
import versionRoutes from "./routes/version.js";
import verifyRoutes from "./routes/verify.js";
import receiptRoutes from "./routes/receipt.js";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "Parmana",
    status: "UP",
  });
});

app.use("/health", healthRoutes);

app.use("/version", versionRoutes);

app.use("/execute", executeRoutes);
app.use(
  "/trust-records",
  trustRecordRoutes
);
app.use(
  "/verify",
  verifyRoutes
);
app.use(
  "/receipt",
  receiptRoutes
);

export default app;