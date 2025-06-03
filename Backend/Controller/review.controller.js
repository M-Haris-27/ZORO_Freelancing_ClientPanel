import { Review } from "../Models/review.model.js";
import { Job } from "../Models/job.model.js";
import { Proposal } from "../Models/proposal.model.js";

// Provide feedback (rating and review)
export const provideFeedback = async (req, res) => {
  try {
    const { jobId, rating, feedback } = req.body;

    const clientId = req.user._id;
    // Validate if the job is completed
    const job = await Job.findById(jobId);
    if (!job || job.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Feedback can only be provided for completed jobs.",
      });
    }

    // Check if feedback already exists for this job
    const existingReview = await Review.findOne({ jobId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Feedback for this job has already been provided.",
      });
    }

    const proposal = await Proposal.findOne({ 
      jobId, 
      status: { $in: ["assigned", "accepted"] } 
    });
    
    if (!proposal) {
      return res.status(400).json({
        success: false,
        message: "Job is not assigned to anyone yet, so you can't add feedback",
      });
    }
    
    // Log the filtered proposals
    console.log(proposal);

    // Create a new review
    const review = await Review.create({
      jobId,
      clientId,
      freelancerId: proposal.freelancerId,
      rating,
      feedback,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      data: review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// View feedback for a specific freelancer or client
export const viewFeedback = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch feedback where the user is either a client or freelancer
    const feedbacks = await Review.find({
      $or: [{ clientId: userId }, { freelancerId: userId }],
    })
      .populate("jobId", "title")
      .populate("clientId", "name email")
      .populate("freelancerId", "name email");

    if (!feedbacks.length) {
      return res.status(404).json({
        success: false,
        message: "No feedback records found for this user.",
      });
    }

    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
