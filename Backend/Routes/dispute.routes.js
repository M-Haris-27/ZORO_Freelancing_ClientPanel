import express from "express";
import { submitDispute } from "../Controller/dispute.controller.js";

const router = express.Router();

// Submit a dispute
router.post("/", submitDispute);

export default router;
