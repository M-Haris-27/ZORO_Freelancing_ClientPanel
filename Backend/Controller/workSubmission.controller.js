import { WorkSubmission } from "../Models/workSubmission.model.js";

// Submit work for a job
export const submitWork = async (req, res) => {
  try {
    const { jobId, freelancerId, links, notes } = req.body;

    const submission = await WorkSubmission.create({ jobId, freelancerId, links, notes });

    res.status(201).json({
      success: true,
      message: "Work submitted successfully.",
      data: submission,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get work submissions for a job (by client)
export const getWorkSubmissions = async (req, res) => {
  try {
    const { jobId } = req.params;

    const submissions = await WorkSubmission.find({ jobId }).populate("freelancerId", "name email");

    if (!submissions.length) {
      return res.status(404).json({ success: false, message: "No submissions found for this job." });
    }

    res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update the status of a work submission (by client)
export const updateWorkSubmissionStatus = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status } = req.body;

    const validStatuses = ["under-review", "approved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const submission = await WorkSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found." });
    }

    submission.status = status;
    await submission.save();

    res.status(200).json({
      success: true,
      message: "Submission status updated successfully.",
      data: submission,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
