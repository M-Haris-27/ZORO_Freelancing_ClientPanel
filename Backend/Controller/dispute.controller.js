import { Dispute } from "../Models/dispute.model.js";
import { Job } from "../Models/job.model.js";

// Submit a dispute by client
export const submitDispute = async (req, res) => {
  try {
    const { jobId, raisedBy, reason } = req.body;

    // Validate that the job exists
    const job = await Job.findById(jobId).populate("clientId");
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // Ensure the dispute is raised by the client associated with the job
    if (job.clientId._id.toString() !== raisedBy) {
      return res.status(403).json({
        success: false,
        message: "Only the client associated with the job can raise a dispute.",
      });
    }

    // Check if there's already an open dispute for this job
    const existingDispute = await Dispute.findOne({ jobId, status: "open" });
    if (existingDispute) {
      return res.status(400).json({
        success: false,
        message: "An open dispute for this job already exists.",
      });
    }

    // Create the dispute
    const dispute = await Dispute.create({
      jobId,
      raisedBy,
      reason,
    });

    res.status(201).json({
      success: true,
      message: "Dispute raised successfully.",
      data: dispute,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
