import express from "express";
import {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getClientJobs,
} from "../Controller/job.controller.js";
import { verifyUserJWT } from "../Middlewares/auth.middleware.js";

const router = express.Router();


//get my job listing
router.get("/my", verifyUserJWT, getClientJobs);


// Create a new job
router.post("/", verifyUserJWT, createJob);

// Update an existing job
router.put("/:id", verifyUserJWT, updateJob);

// Delete a job
router.delete("/:id", verifyUserJWT, deleteJob);

// Get all jobs
router.get("/", verifyUserJWT, getAllJobs);

// Get a job by ID
router.get("/:id", verifyUserJWT, getJobById);

export default router;