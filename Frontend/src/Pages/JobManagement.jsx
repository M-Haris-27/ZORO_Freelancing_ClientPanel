import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Clock, DollarSign, Briefcase, X } from 'lucide-react';
import axios from 'axios';
const JobDetailsModal = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"
        >
          <X size={24} />
        </button>

        {/* Job Header */}
        <div className="bg-gradient-to-r from-[#cae962] to-[#abc653] p-6 text-[#0B1724]">
          <h2 className="text-3xl font-bold flex items-center">
            <Briefcase className="mr-4" size={32} />
            {job.title}
          </h2>
        </div>

        {/* Job Details Content */}
        <div className="p-8 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Job Description</h3>
            <p className="text-gray-600">{job.description}</p>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill) => (
                <span 
                  key={skill} 
                  className="bg-[#cae962] bg-opacity-20 text-[#0B1724] px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <DollarSign className="mr-2 text-green-500" size={20} />
                <span className="font-semibold text-gray-700">Budget</span>
              </div>
              <p className="text-gray-600">${job.budget}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Clock className="mr-2 text-blue-500" size={20} />
                <span className="font-semibold text-gray-700">Duration</span>
              </div>
              <p className="text-gray-600">{job.duration}</p>
            </div>
          </div>

          {/* Status */}
          <div className="mt-4">
            <span 
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                job.status === 'open' ? 'bg-green-100 text-green-800' : 
                job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                job.status === 'completed' ? 'bg-gray-100 text-gray-800' : 
                'bg-red-100 text-red-800'
              }`}
            >
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    skillsRequired: [],
    budget: '',
    duration: '',
    status: 'open'
  });
  const [editingJobId, setEditingJobId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map((skill) => skill.trim());
    setJobForm((prev) => ({
      ...prev,
      skillsRequired: skills,
    }));
    console.log(skills);
  };
  
  const handleCreateJob = async (e) => {
    e.preventDefault();
  
    const jobData = {
      ...jobForm,
    };
  
    try {
      if (editingJobId) {
        // Update existing job
        const response = await fetch(`http://localhost:4000/api/v1/jobs/${editingJobId}`, {
          method: 'PUT',
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jobData),
        }); console.log(response);
  
        const updatedJob = await response.json();
        console.log('Updated Job:', updatedJob);
        setJobs((prevJobs) =>
          prevJobs.map((job) => (job._id === updatedJob._id ? updatedJob : job))
        );
        setEditingJobId(null);
      } else {
        // Create new job
        const response = await fetch('http://localhost:4000/api/v1/jobs', {
          method: 'POST',
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jobData),
        });
  
        const newJob = await response.json();
        console.log(newJob);
        setJobs((prevJobs) => [...prevJobs, newJob.data]);
      }
  
      // Reset form
      setJobForm({
        title: '',
        description: '',
        skillsRequired: [],
        budget: '',
        duration: '',
        status: 'open',
      });
    } catch (error) {
      console.error('Error creating/updating job:', error);
    }
  };
  
  const startEditJob = (job) => {
    setEditingJobId(job._id);
    setJobForm({
      title: job.title,
      description: job.description,
      skillsRequired: job.skillsRequired,
      budget: job.budget,
      duration: job.duration,
      status: job.status,
    });
  };
  
  const handleDeleteJob = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/jobs/${jobId}`, {
        method: 'DELETE',
        credentials: "include",
      });
  
      if (response.ok) {
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      } else {
        console.error('Error deleting job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };
  
  const handleViewJobDetails = (job) => {
    setSelectedJob(job);
  };


    useEffect(() => {
      const fetchJobs = async () => {
        try{
          const response = await fetch(`http://localhost:4000/api/v1/jobs/my` , {
            method: "GET",
            credentials: "include"
          });

          const data = await response.json();
          if(response.status > 400) {
            throw new Error(data.message);
          }

          setJobs(data.data);

        } catch(error) {
          console.log(error);
        }
      }


      fetchJobs();
      
    }, [jobs]); 
  

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />
      )}

<div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B1724] to-[#2C3E50] p-6 flex items-center justify-center">
        <Plus className="mr-4 text-[#cae962]" size={40} />
        <h1 className="text-3xl font-bold text-white">Job Management</h1>
      </div>

        {/* Job Creation Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-10 border border-gray-100 transform transition-all ">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {editingJobId ? 'Edit Job' : 'Post New Job'}
            </h2>
            <div className="text-sm text-gray-500">All fields are required</div>
          </div>
          
          <form onSubmit={handleCreateJob} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={jobForm.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#cae962] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Budget</label>
                <input
                  type="number"
                  name="budget"
                  value={jobForm.budget}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#cae962] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={jobForm.description}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#cae962] h-32 resize-none transition-all"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skills Required</label>
                <input
                  type="text"
                  value={jobForm.skillsRequired.join(', ')}
                  onChange={handleSkillsChange}
                  placeholder="Enter skills separated by comma"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#cae962] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                <select
                  name="duration"
                  value={jobForm.duration}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#cae962] transition-all"
                >
                  <option value="">Select Duration</option>
                  <option value="short-term">Short-term</option>
                  <option value="long-term">Long-term</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="bg-[#cae962] text-[#0B1724] px-10 py-3 rounded-lg font-bold hover:bg-[#abc653] transition duration-300 shadow-lg hover:shadow-xl flex items-center"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default form submission
                  handleCreateJob(e); // Call the function to create/update the job
                }}
              >
                <Plus className="mr-2" /> {editingJobId ? 'Update Job' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>

        {/* Job Listing */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Job Listings</h2>
          
          {jobs.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-lg">No jobs posted yet</p>
              <p className="text-sm">Start by creating a new job posting</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div 
                  key={job._id} 
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer"
                  onClick={() => handleViewJobDetails(job)}
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                      <Briefcase className="mr-2 text-[#cae962]" size={24} />
                      {job.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skillsRequired.map((skill) => (
                        <span 
                          key={skill} 
                          className="bg-[#cae962] bg-opacity-20 text-[#0B1724] px-2 py-1 rounded-full text-xs font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <DollarSign className="mr-2 text-green-500" size={16} />
                      <span><strong>Budget:</strong> ${job.budget}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 text-blue-500" size={16} />
                      <span><strong>Duration:</strong> {job.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <span 
                        className={`font-semibold flex items-center ${
                          job.status === 'open' ? 'text-green-600' : 
                          job.status === 'in-progress' ? 'text-blue-600' : 
                          job.status === 'completed' ? 'text-gray-600' : 
                          'text-red-600'
                        }`}
                      >
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditJob(job);
                      }}
                      className="flex-grow bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition flex items-center justify-center"
                    >
                      <Pencil size={18} className="mr-2" /> Edit
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteJob(job._id);
                      }} 
                      className="noselect"
                    >
                      <span className="text">Delete</span>
                      <span className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                         
      <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
    </svg>
  </span>
</button>

<style jsx>{`
  .noselect {
    width: 150px;
    height: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    background: #e62222;
    border: none;
    border-radius: 5px;
    box-shadow: 1px 1px 3px rgba(0,0,0,0.15);
  }

  .noselect, .noselect span {
    transition: 200ms;
  }

  .noselect .text {
    transform: translateX(35px);
    color: white;
    font-weight: bold;
  }

  .noselect .icon {
    position: absolute;
    border-left: 1px solid #c41b1b;
    transform: translateX(110px);
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .noselect .icon svg {
    width: 15px;
    fill: #eee;
  }

  .noselect:hover {
    background: #ff3636;
  }

  .noselect:hover .text {
    color: transparent;
  }

  .noselect:hover .icon {
    width: 150px;
    border-left: none;
    transform: translateX(0);
  }

  .noselect:focus {
    outline: none;
  }

  .noselect:active .icon svg {
    transform: scale(0.8);
  }
`}</style>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobManagement;