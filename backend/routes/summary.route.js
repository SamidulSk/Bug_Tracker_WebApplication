import express from "express";
import { generateDailySummary, getSummaryHistory } from "../controller/summary.controller.js";
import { verifyToken } from "../jwt/token.js";

const router = express.Router();

router.post("/generate", verifyToken, generateDailySummary);
router.get("/history", verifyToken, getSummaryHistory);

export default router;
