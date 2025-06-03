import React, { useState, useEffect } from 'react';
import { FolderGit2 } from 'lucide-react';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Edit, 
  RefreshCw, 
  Award 
} from 'lucide-react';

// Base URL of the API (replace with your actual API URL)
const BASE_API_URL = 'http://localhost:4000/api/v1';

const WorkSubmissionsTracking = () => {
  const [jobs, setJobs] = useState([]); // State to store jobs
  const [submissions, setSubmissions] = useState([]); // State to store submissions
  const [users, setUsers] = useState([]); // State to store users (freelancers)
  const [selectedJobId, setSelectedJobId] = useState(''); // State to store selected job ID
  const [selectedSubmission, setSelectedSubmission] = useState(null); // State for selected submission
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(null); // State for errors

  // Fetch jobs from the API using fetch
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}/jobs`, { 
        method: 'GET', 
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      setJobs(data.data); // Store the list of jobs
      setLoading(false);
    } catch (err) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  // Fetch users (freelancers) from the API using fetch
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/users/all`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.data); // Store the list of users (freelancers)
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    }
  };

  // Fetch work submissions for the selected job using fetch
  const fetchWorkSubmissions = async (jobId) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}/workSubmissions/${jobId}`, { 
        method: 'GET', 
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch work submissions');
      }
      const data = await response.json();
      setSubmissions(data.data); // Store the list of submissions
      setLoading(false);
    } catch (err) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  // Update submission status (by client) using fetch
  const updateSubmissionStatus = async (submissionId, status) => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/workSubmissions/${submissionId}/status`, 
        { 
          method: 'PATCH', 
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status })
        }
      );
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      const data = await response.json();

      // Update local state to reflect the status change
      setSubmissions(prevSubmissions => 
        prevSubmissions.map(submission => 
          submission._id === submissionId 
            ? { ...submission, status: data.data.status } 
            : submission
        )
      );

      // Reset selected submission if it was updated
      if (selectedSubmission?._id === submissionId) {
        const updatedSubmission = submissions.find(s => s._id === submissionId);
        setSelectedSubmission({ ...updatedSubmission, status });
      }

      alert(`Submission status updated to ${status}`);
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  // Fetch jobs, users, and submissions on component mount
  useEffect(() => {
    fetchJobs();
    fetchUsers(); // Fetch freelancers (users)
  }, []);

  // Fetch submissions whenever the selected job changes
  useEffect(() => {
    if (selectedJobId) {
      fetchWorkSubmissions(selectedJobId);
    }
  }, [selectedJobId]);

  // Status color mapping
  const getStatusColor = (status) => {
    const statusColors = {
      'submitted': 'bg-blue-100 text-blue-800',
      'under-review': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  // Render status badge
  const renderStatusBadge = (status) => (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  );

  // Loading and error states
  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error: {error}</div>;

  // Find freelancer name by id
  const getFreelancerName = (freelancerId) => {
    const freelancer = users.find(user => user._id === freelancerId);
    return freelancer ? freelancer.firstName : 'Unknown Freelancer';
  };

  // Find job title by id
  const getJobTitle = (jobId) => {
    const job = jobs.find(job => job._id === jobId);
    return job ? job.title : 'Unknown Job';
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B1724] to-[#2C3E50] p-6 flex items-center justify-center">
        <FolderGit2 className="mr-4 text-[#cae962]" size={40} />
        <h1 className="text-3xl font-bold text-white">Work Submissions</h1>
      </div>

      {/* Job Selector */}
      <div className="p-6">
        <label htmlFor="jobId" className="font-semibold text-lg mx-5">Select Job:</label>
        <select 
          id="jobId"
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className="p-2 border rounded-lg mt-2"
        >
          <option value="">Select a Job</option>
          {jobs.map(job => (
            <option key={job._id} value={job._id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      {/* Submissions List */}
      {selectedJobId && (
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {submissions.map(submission => (
            <div 
              key={submission._id} 
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-all cursor-pointer"
              onClick={() => setSelectedSubmission(submission)}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Job Submission for: {getJobTitle(submission.jobId)}
                </h2>
                {renderStatusBadge(submission.status)}
              </div>

              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>Freelancer: {getFreelancerName(submission.freelancerId)}</span>
                <span>Submitted on: {new Date(submission.createdAt).toLocaleDateString()}</span>
              </div>

              <div>
                <h3 className="font-medium mb-2">Submission Links</h3>
                {submission.links && submission.links.map((link, index) => (
                  <a 
                    key={index} 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline block"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Submission View */}
      {selectedSubmission && (
        <div className="mt-8 bg-white shadow-md rounded-lg p-6 mx-6 mb-6">
          <h2 className="text-2xl font-bold mb-6">Submission Details</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Submission Information */}
            <div>
              <h3 className="font-semibold mb-4">Submission Overview</h3>
              <p><strong>Freelancer:</strong> {getFreelancerName(selectedSubmission.freelancerId)}</p>
              <p><strong>Submitted on:</strong> {new Date(selectedSubmission.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {renderStatusBadge(selectedSubmission.status)}</p>
            </div>

            {/* Submission Actions */}
            <div>
              <h3 className="font-semibold mb-4 mx-11">Actions</h3>
              <button 
                className="bg-[#cae962] text-black px-6 py-2 rounded-lg mb-2 hover:bg-[#adc854] transition"
                onClick={() => updateSubmissionStatus(selectedSubmission._id, 'approved')}
              >
                Approve Submission
              </button>
              <br />
              <button 
              
                className="bg-[#112437] text-white px-4 py-2 rounded-lg mb-2 hover:bg-[#44607c]"
                onClick={() => updateSubmissionStatus(selectedSubmission._id, 'under-review')}
              >
                Mark as Under Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkSubmissionsTracking;
