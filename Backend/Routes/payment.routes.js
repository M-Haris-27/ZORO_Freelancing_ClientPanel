import express from "express";
import {
  makePayment,
  viewPaymentHistory,
  releasePayment,
} from "../Controller/payment.controller.js";
import { verifyUserJWT } from "../Middlewares/auth.middleware.js";
const router = express.Router();

// Make a payment
router.post("/", verifyUserJWT, makePayment);

// View payment history for a user (client or freelancer)
router.get("/history", verifyUserJWT, viewPaymentHistory);

// Release payment
router.put("/:paymentId/release", verifyUserJWT, releasePayment);

export default router;
