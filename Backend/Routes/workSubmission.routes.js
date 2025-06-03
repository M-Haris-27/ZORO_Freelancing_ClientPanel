import express from "express";
import {
  submitWork,
  getWorkSubmissions,
  updateWorkSubmissionStatus,
} from "../Controller/workSubmission.controller.js";

const router = express.Router();

// Submit work for a job (freelancer)
router.post("/", submitWork);

// Get all submissions for a job (client)
router.get("/:jobId", getWorkSubmissions);

// Update submission status (client)
router.patch("/:submissionId/status", updateWorkSubmissionStatus);

export default router;
