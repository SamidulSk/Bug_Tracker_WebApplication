import express from "express";
import { generateTagsForBug, getAllTags } from "../controller/tag.controller.js";
import { verifyToken } from "../jwt/token.js";

const router = express.Router();

// AI tag generation for a bug
router.post("/generate/:bugId", verifyToken, generateTagsForBug);

// Get all tags
router.get("/", getAllTags);

export default router;
