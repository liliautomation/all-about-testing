import express from "express";
import { getTestStrategies } from "../services/strategiesService";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(getTestStrategies());
});

export default router;
