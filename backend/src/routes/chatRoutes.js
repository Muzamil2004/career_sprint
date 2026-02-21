import express from "express";
import { generateInterviewFeedback, getStreamToken } from "../controllers/chatController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);
router.post("/feedback", protectRoute, generateInterviewFeedback);

export default router;
