import { Proposal } from "../Models/proposal.model.js";
import { Job } from "../Models/job.model.js";

// View all proposals for a specific job
export const getProposalsByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;
    const proposals = await Proposal.find({ jobId })
      .populate("freelancerId", "name email") // Populate freelancer details
      .populate("jobId", "title"); // Populate job details

    if (!proposals.length) {
      return res.status(404).json({ success: false, message: "No proposals found for this job." });
    }

    res.status(200).json({ success: true, data: proposals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Shortlist a freelancer for a proposal
export const shortlistFreelancer = async (req, res) => {
  try {
    const { id } = req.params; // Proposal ID
    const proposal = await Proposal.findByIdAndUpdate(
      id,
      { status: "accepted" },
      { new: true, runValidators: true }
    );

    if (!proposal) {
      return res.status(404).json({ success: false, message: "Proposal not found." });
    }

    res.status(200).json({ success: true, message: "Freelancer shortlisted successfully.", data: proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject a proposal
export const rejectProposal = async (req, res) => {
  try {
    const { id } = req.params; // Proposal ID
    const proposal = await Proposal.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true, runValidators: true }
    );

    if (!proposal) {
      return res.status(404).json({ success: false, message: "Proposal not found." });
    }

    res.status(200).json({ success: true, message: "Proposal rejected successfully.", data: proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign job to freelancer
export const assignJobToFreelancer = async (req, res) => {
  try {
    const { proposalId } = req.params;

    // Fetch the proposal and populate the associated job and freelancer details
    const proposal = await Proposal.findById(proposalId)
      .populate("jobId")
      .populate("freelancerId");

    if (!proposal) {
      return res.status(404).json({ 
        success: false, 
        message: "Proposal not found." 
      });
    }

    // Ensure the proposal status is 'accepted' before assigning
    if (proposal.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Only accepted proposals can be assigned.",
      });
    }

    // Check if the job is already assigned to another freelancer
    if (proposal.jobId.status === "in-progress") {
      return res.status(400).json({
        success: false,
        message: "Job is already assigned to another freelancer.",
      });
    }

    // Update the proposal status to 'assigned'
    proposal.status = "assigned";
    await proposal.save();

    // Update the job status to 'in-progress' and assign the freelancer
    const updatedJob = await Job.findByIdAndUpdate(
      proposal.jobId._id,
      { 
        status: "in-progress", 
        freelancerId: proposal.freelancerId._id 
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found or failed to update.",
      });
    }

    // Respond with success message and updated job details
    res.status(200).json({
      success: true,
      message: "Job successfully assigned to freelancer.",
      data: {
        job: updatedJob,
        freelancer: proposal.freelancerId,
        proposal: proposal,
      },
    });
  } catch (error) {
    console.error("Error assigning job:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while assigning the job.",
      error: error.message,
    });
  }
};


export const createProposals = async (req, res) => {
  try {
    const { jobId, freelancerId, coverLetter, bidAmount } = req.body;

    if (!jobId || !freelancerId || !coverLetter || !bidAmount) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const newProposal = new Proposal({
      jobId,
      freelancerId,
      coverLetter,
      bidAmount,
      status: "pending", // Default status
    });

    await newProposal.save();
    res.status(201).json({ success: true, message: "Proposal created successfully.", data: newProposal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



