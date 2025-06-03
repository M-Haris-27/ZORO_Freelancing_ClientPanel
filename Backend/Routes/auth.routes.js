import express from "express";
import { 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerClient, 
    changePassword, // Add this import
    forgotPassword
} from "../Controller/auth.controller.js";
import { verifyUserJWT } from "../Middlewares/auth.middleware.js";

const router = express.Router();

// User auth routes:
router.post("/register-client", registerClient);
router.post("/login-user", loginUser);
router.post("/logout-user", verifyUserJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.put("/change-password", verifyUserJWT, changePassword);
router.post("/forgot-password", forgotPassword);

export default router;
