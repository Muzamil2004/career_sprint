import express from "express";
import { register, login, logout, getCurrentUser } from "../controllers/authController.js";
import { googleAuth } from "../controllers/oauthController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/logout", protectRoute, logout);
router.get("/me", protectRoute, getCurrentUser);

export default router;
