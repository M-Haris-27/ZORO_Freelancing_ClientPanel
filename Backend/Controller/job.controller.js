import { Job } from "../Models/job.model.js";
import { asyncHandler } from "../Utils/AsyncHandler.js";

// Create a new job
export const createJob = async (req, res) => {
  try {
    const { title, description, skillsRequired, budget, duration } = req.body;
    const clientId = req.user._id;

    const job = new Job({ clientId, title, description, skillsRequired, budget, duration });
    await job.save();
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an existing job
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, skillsRequired, budget, duration, status } = req.body;
    const job = await Job.findByIdAndUpdate(
      id,
      { title, description, skillsRequired, budget, duration, status },
      { new: true, runValidators: true }
    );
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a job
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all jobs (optional: can filter by client or status)
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("clientId", "name email"); // Adjust fields to populate as needed
    console.log("All Jobs: ",jobs);
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get job details by ID
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate("clientId", "name email");
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    console.log("All Jobs: ",jobs);
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getClientJobs = async (req, res) => {
  try {
    const clientId = req.user._id;

    if (!clientId) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    // Fetch jobs created by the client
    const myJobs = await Job.find({ clientId })
      .populate("clientId", "name email") // Populate client details (optional)
      .sort({ createdAt: -1 }); // Sort jobs by creation date in descending order

    if (myJobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No jobs found for this client",
      });
    }

    res.status(200).json({
      success: true,
      message: "Jobs retrieved successfully",
      data: myJobs,
    });
    
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      message: "Server error, unable to fetch jobs",
      error: error.message,
    });
  }
};
