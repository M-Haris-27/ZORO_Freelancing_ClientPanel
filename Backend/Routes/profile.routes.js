import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from "../Controller/profile.controller.js";
import { verifyUserJWT } from "../Middlewares/auth.middleware.js";

const router = express.Router();

// User routes
router.get("/", verifyUserJWT, getUserProfile); // Get user profile
router.put("/", verifyUserJWT, updateUserProfile); // Update user profile
router.delete("/", verifyUserJWT, deleteUserProfile); // Delete user profile

export default router;
