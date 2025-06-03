import React, { useState, useEffect } from 'react';
import { FileCode, DollarSign, Check, X, User, Briefcase, Mail, Award, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const ProposalManagementPage = () => {
  const [jobs, setJobs] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // Fetch jobs from the backend on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/jobs', {
          method: 'GET',
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setJobs(data.data); // Assuming 'data.jobs' contains the jobs array
        } else {
          console.error('Failed to fetch jobs:', data.message);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  // Fetch proposals when a job is selected
  useEffect(() => {
    if (selectedJob) {
      fetchProposals(selectedJob._id);
    }
  }, [selectedJob]);

  // Fetch proposals from backend
  const fetchProposals = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/proposals/job/${jobId}`, {
        method: 'GET',
        credentials: "include",
      }
      );
      
      const data = await response.json();
      if (data.success) {
        setProposals(data.data); // Assuming 'data.proposals' contains the proposals
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  const handleJobSelect = (e) => {
    const selectedJobId = e.target.value;
    const job = jobs.find((j) => j._id === selectedJobId);
    setSelectedJob(job);
  };

  const handleShortlistFreelancer = async (proposalId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/proposals/${proposalId}/shortlist`, {
        method: 'PUT',
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setProposals(prevProposals =>
          prevProposals.map(proposal =>
            proposal._id === proposalId ? { ...proposal, status: 'accepted' } : proposal
          )
        );
      }
    } catch (error) {
      console.error('Error shortlisting freelancer:', error);
    }
  };

  const handleRejectProposal = async (proposalId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/proposals/${proposalId}/reject`, {
        method: 'PUT',
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setProposals(prevProposals =>
          prevProposals.map(proposal =>
            proposal._id === proposalId ? { ...proposal, status: 'rejected' } : proposal
          )
        );
      }
    } catch (error) {
      console.error('Error rejecting proposal:', error);
    }
  };

  const handleAssignJob = async (proposalId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/proposals/${proposalId}/assign`, // API endpoint
        {
          method: "PUT",
          credentials: "include", // Include cookies if required for authentication
          headers: {
            "Content-Type": "application/json", // Specify JSON content type
          },
        }
      );
  
      if (!response.ok) {
        // If the response is not OK, handle the error
        const errorData = await response.json();
        console.error("Failed to assign job:", errorData.message);
        return;
      }
  
      const data = await response.json(); // Parse the JSON response
  
      if (data.success) {
        // Update the state to show "assigned" status for the relevant proposal
        setProposals((prevProposals) =>
          prevProposals.map((proposal) =>
            proposal._id === proposalId
              ? { ...proposal, status: "assigned" }
              : proposal
          )
        );
  
        // Log success messages
        console.log(
          `Job successfully assigned to freelancer ${data.data.freelancer.firstName} ${data.data.freelancer.lastName}`
        );
        console.log(`Proposal status: ${data.data.proposal.status}`); // Should log 'assigned'
      } else {
        console.error("Assignment failed:", data.message);
      }
    } catch (error) {
      console.error("Error assigning job:", error.message);
    }
  };
  
  

  // Status configuration
  const statusConfig = {
    pending: {
      icon: Clock, // Icon for pending
      color: 'text-yellow-600 bg-yellow-50', // Styling for pending
      description: 'Under Review', // Description for pending
    },
    accepted: {
      icon: CheckCircle, // Icon for accepted
      color: 'text-green-600 bg-green-50', // Styling for accepted
      description: 'Shortlisted', // Description for accepted
    },
    rejected: {
      icon: AlertTriangle, // Icon for rejected
      color: 'text-red-600 bg-red-50', // Styling for rejected
      description: 'Not Selected', // Description for rejected
    },
    assigned: {
      icon: Briefcase, // Add an appropriate icon for 'assigned' (e.g., a briefcase or checkmark)
      color: 'text-blue-600 bg-blue-50', // Styling for assigned
      description: 'Assigned to Freelancer', // Description for assigned
    },
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B1724] to-[#2C3E50] p-6 flex items-center justify-center">
          <FileCode className="mr-4 text-[#cae962]" size={40} />
          <h1 className="text-3xl font-bold text-white">Proposal Management Dashboard</h1>
        </div>

        {/* Job Selection */}
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Select Job</label>
            <select 
              value={selectedJob?._id || ''} 
              onChange={handleJobSelect} 
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cae962] transition duration-300"
            >
              <option value="" disabled>Choose a job to view proposals</option>
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          {selectedJob && (
            <div>
              {/* Job Details Card */}
              <div className="bg-gray-100 rounded-lg p-6 mb-6 border-l-4 border-[#cae962]">
                <div className="flex items-center mb-4">
                  <Briefcase className="mr-3 text-[#0B1724]" />
                  <h2 className="text-2xl font-bold text-[#0B1724]">{selectedJob.title}</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-700"><strong>Description:</strong> {selectedJob.description}</p>
                    <div className="mt-2 flex items-center">
                      <Award className="mr-2 text-[#cae962]" size={20} />
                      <span><strong>Required Skills:</strong> {selectedJob.skillsRequired.join(', ')}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-700"><strong>Budget Range:</strong> ${selectedJob.budget}</p>
                    <p className="text-gray-700"><strong>Estimated Duration:</strong> {selectedJob.duration}</p>
                  </div>
                </div>
              </div>

              {/* Proposals Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-[#0B1724]">Proposals</h3>
                
                {proposals.length === 0 ? (
                  <div className="text-center py-8 bg-gray-100 rounded-lg">
                    <p className="text-gray-500 text-lg">No proposals found for this job.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {proposals.map((proposal) => {
                      const StatusIcon = statusConfig[proposal.status].icon;
                      const statusColor = statusConfig[proposal.status].color;
                      const statusDescription = statusConfig[proposal.status].description;

                      return (
                        <div 
                          key={proposal._id} 
                          className={`
                            bg-white border-l-4 p-6 rounded-lg shadow-md transition-all duration-300
                            ${proposal.status === 'pending' ? 'border-yellow-400 hover:shadow-lg' : 
                              proposal.status === 'accepted' ? 'border-green-400' : 
                              proposal.status === 'assigned' ? 'border-blue-400' : 
                              'border-red-400'}
                          `}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-grow pr-4">
                              <div className="flex items-center mb-3 justify-between">
                                <div className="flex items-center">
                                  <User className="mr-2 text-[#0B1724]" />
                                  <h4 className="text-xl font-bold text-[#0B1724]">{proposal.freelancerId.name}</h4>
                                </div>
                                
                                {/* Status Badge */}
                                <div className={`flex items-center px-3 py-1 rounded-full ${statusColor}`}>
                                  <StatusIcon className="mr-2" size={16} />
                                  <span className="font-semibold text-sm">{statusDescription}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center mb-2">
                                <Mail className="mr-2 text-gray-500" size={18} />
                                <p className="text-gray-500 text-sm">{proposal.freelancerId.email}</p>
                              </div>
                              <div className="flex items-center mb-2">
                                <Clock className="mr-2 text-gray-500" size={18} />
                                <p className="text-gray-500 text-sm">{proposal.coverLetter}</p>
                              </div>
                              <div className="flex items-center mb-2">
                                <DollarSign className="mr-2 text-gray-500" size={18} />
                                <p className="text-gray-500 text-sm">{proposal.expectedBudget}$</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              {proposal.status === 'pending' && (
                                <div>
                                  <button
                                    onClick={() => handleShortlistFreelancer(proposal._id)}
                                    className="bg-[#cae962] text-black px-4 py-2 rounded-md font-semibold mx-5 hover:bg-[#b3d057] transition duration-300"
                                  >
                                    Shortlist
                                  </button>
                                  <button
                                    onClick={() => handleRejectProposal(proposal._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold mx-5 hover:bg-red-600 transition duration-300 ml-5 mt-2"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                              {proposal.status === 'accepted' && (
                                <button
                                  onClick={() => handleAssignJob(proposal._id)}
                                  className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-300"
                                >
                                  Assign Job
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalManagementPage;
