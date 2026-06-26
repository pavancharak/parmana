import express from "express";
import "dotenv/config";

import { RuntimeFactory } from "@parmana/runtime";

const app = express();
app.use(express.json());

// ✅ CLEAN: no constructors leaked into API
const runtime = RuntimeFactory.create();

app.get("/", (_req, res) => {
  res.json({ status: "API running" });
});

app.post("/execute", async (req, res) => {
  try {
    const result = await runtime.execute(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});