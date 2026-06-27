import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    name: "Parmana",
    version: "0.4.0",
    api: "v1",
  });
});

export default router;
