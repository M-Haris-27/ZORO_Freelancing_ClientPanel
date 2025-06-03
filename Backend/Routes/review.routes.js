import express from "express";
import { provideFeedback, viewFeedback } from "../Controller/review.controller.js";
import { verifyUserJWT } from "../Middlewares/auth.middleware.js";

const router = express.Router();

// Provide feedback (rating and review)
router.post("/", verifyUserJWT, provideFeedback);

// View feedback history for a specific user (freelancer or client)
router.get("/history", verifyUserJWT, viewFeedback);

export default router;
