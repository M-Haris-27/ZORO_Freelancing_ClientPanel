import { Payment } from "../Models/payment.model.js";
import { Job } from "../Models/job.model.js";
import { Earnings } from "../Models/earnings.model.js";

// Make a payment (process payment to a freelancer)
export const makePayment = async (req, res) => {
  try {
    const { jobId, clientId, freelancerId, amount } = req.body;

    // Validate if job exists and is in-progress
    const job = await Job.findById(jobId);
    if (!job || job.status !== "in-progress") {
      return res.status(400).json({
        success: false,
        message: "Payment cannot be processed for this job. Job must be in-progress.",
      });
    }

    const payment = await Payment.create({
      jobId,
      clientId,
      freelancerId,
      amount,
    });

    res.status(201).json({
      success: true,
      message: "Payment initiated successfully.",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// View payment history for a specific user
export const viewPaymentHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const payments = await Payment.find({
      $or: [{ clientId: userId }, { freelancerId: userId }],
    })
      .populate("jobId", "title")
      .populate("clientId", "name email")
      .populate("freelancerId", "name email");

    if (!payments.length) {
      return res.status(404).json({
        success: false,
        message: "No payment records found for this user.",
      });
    }

    console.log(payments);

    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const releasePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Mark the payment as completed
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status: "completed" },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found." });
    }

    // Update the freelancer's earnings
    const freelancerEarnings = await Earnings.findOneAndUpdate(
      { freelancerId: payment.freelancerId },
      {
        $inc: { totalEarnings: payment.amount },
        $pull: { transactions: { paymentId } }, // Remove it from pending transactions if needed
        $push: {
          transactions: {
            paymentId: payment._id,
            amount: payment.amount,
            status: "completed",
          },
        },
      },
      { new: true, upsert: true } // Create the record if it doesn't exist
    );

    if (!freelancerEarnings) {
      return res.status(500).json({
        success: false,
        message: "Failed to update freelancer earnings.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment released successfully, and freelancer earnings updated.",
      data: { payment, freelancerEarnings },
    });
  } catch (error) {
    console.error("Error releasing payment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};