import express from "express";

import { RuntimeFactory } from "@parmana/runtime";

import {
  MemoryBusinessTransactionRepository,
  MemoryExecutionTrustRecordRepository,
} from "@parmana/storage";

const app = express();

app.use(express.json());

const runtime = RuntimeFactory.create(
  new MemoryBusinessTransactionRepository(),
  new MemoryExecutionTrustRecordRepository()
);

app.get("/", (_req, res) => {
  res.json({
    status: "API running",
  });
});

app.post("/execute", async (req, res) => {
  try {
    const result = await runtime.execute(req.body);

    res.json(result);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Unknown error";

    res.status(500).json({
      error: message,
    });
  }
});

export default app;