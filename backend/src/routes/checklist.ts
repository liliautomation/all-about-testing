import express from "express";
import { getTestingTopics } from "../services/checklistService";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(getTestingTopics());
});

export default router;