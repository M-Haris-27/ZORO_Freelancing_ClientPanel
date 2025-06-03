import express from "express";
import { verifyUserJWT } from "../Middlewares/auth.middleware.js";
import { 
    getUserProfile, 
    updateUserProfile, 
    deleteUserProfile, 
    getUser,
    getAllUsers
} from "../Controller/user.controller.js";

const router = express.Router();

// User routes
router.get("/all", verifyUserJWT, getAllUsers); // Get user profile
router.get("/me", verifyUserJWT, getUserProfile); // Get user profile
router.put("/me", verifyUserJWT, updateUserProfile); // Update user profile
router.delete("/me", verifyUserJWT, deleteUserProfile); // Delete user profile
router.get("/:userId", verifyUserJWT, getUser);
export default router;