import express from "express";
import "dotenv/config";

import { RuntimeFactory } from "@parmana/runtime";

import {
  MemoryBusinessTransactionRepository,
  MemoryExecutionTrustRecordRepository,
} from "@parmana/storage";

const app = express();

app.use(express.json());

//
// Infrastructure
//
const transactionRepository =
  new MemoryBusinessTransactionRepository();

const trustRecordRepository =
  new MemoryExecutionTrustRecordRepository();

//
// Runtime
//
const runtime = RuntimeFactory.create(
  transactionRepository,
  trustRecordRepository
);

app.get("/", (_req, res) => {
  res.json({
    status: "API running",
  });
});

app.post(
  "/execute",
  async (req, res) => {
    try {
      const result =
        await runtime.execute(req.body);

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
  }
);

app.listen(3000, () => {
  console.log(
    "API running on http://localhost:3000"
  );
});