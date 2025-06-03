import express from "express";
import {
  getProposalsByJobId,
  shortlistFreelancer,
  rejectProposal,
  assignJobToFreelancer,
  createProposals,
} from "../Controller/proposal.controller.js";

const router = express.Router();

// View all proposals for a specific job
router.get("/job/:jobId", getProposalsByJobId);

// Shortlist a freelancer
router.put("/:id/shortlist", shortlistFreelancer);

// Reject a freelancer's proposal
router.put("/:id/reject", rejectProposal);

// Assign job to a freelancer (based on proposal ID)
router.put("/:proposalId/assign", assignJobToFreelancer);

router.post('/proposals', createProposals);

export default router;
