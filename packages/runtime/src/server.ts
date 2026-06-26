import express from "express";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "Runtime API running" });
});

app.listen(3000, () => {
  console.log("Runtime API running on port 3000");
});