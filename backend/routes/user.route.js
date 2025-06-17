import express from "express";
import { register, login, logout, getUserProfile} from "../controller/user.controller.js";
import { verifyToken } from "../jwt/token.js"; // Adjust if middleware path is different

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Protected route (for testing token verification)
router.get("/me", verifyToken, getUserProfile);

export default router;
