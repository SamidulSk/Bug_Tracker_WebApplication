import express from "express";
import {
  createBug,
  getBugList,
  updateBug,
  deleteBug,
} from "../controller/bug.controller.js";
import { verifyToken } from "../jwt/token.js";

const router = express.Router();

// ✅ Create a new bug
router.post("/createBug", verifyToken, createBug);

// ✅ Get all bugs for logged-in user
router.get("/getBugList", verifyToken, getBugList);

// ✅ Update a bug
router.put("/updateBug/:id", verifyToken, updateBug);

// ✅ Delete a bug
router.delete("/:id", verifyToken, deleteBug);

export default router;
