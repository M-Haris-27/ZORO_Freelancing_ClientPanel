import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, MessageSquareText } from 'lucide-react';
import axios from 'axios';

const RatingsFeedback = ({ clientId }) => {
  const [activeTab, setActiveTab] = useState('provide');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedJob, setSelectedJob] = useState({ jobId: '', clientId: '', freelancerId: ''});
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  // Fetch available completed jobs and feedback history
  // Fetch available completed jobs and feedback history
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch completed jobs for the client
        const jobsResponse = await fetch('http://localhost:4000/api/v1/jobs', {
          credentials: "include"
        });
        if (!jobsResponse.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const jobsData = await jobsResponse.json();
        setJobs(jobsData.data);

        // Fetch feedback history if activeTab is 'history'
        if (activeTab === 'history') {
          const historyResponse = await fetch(
            `http://localhost:4000/api/v1/reviews/history`,
            {
              method: 'GET',
              credentials: 'include',
            }
          );
          if (!historyResponse.ok) {
            throw new Error('Failed to fetch feedback history');
          }
          const historyData = await historyResponse.json();
          console.log(historyData);
          // Transform the data to match the component's expected format
          const transformedHistory = historyData.data.map(item => ({
            id: item._id,
            jobTitle: item.jobId.title,
            rating: item.rating,
            feedback: item.feedback,
            freelancerName: item.freelancerId.email,
            date: new Date(item.createdAt).toLocaleDateString(),
          }));
          console.log(transformedHistory);
          setFeedbackHistory(transformedHistory);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
      }
    };

    fetchData();
  }, [clientId, activeTab]);

  // Handle form submission
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setError(null);
    
    const formData = {
      jobId: selectedJob,
      rating,
      feedback,
    }
    try {
      // Submit feedback
      const response = await fetch('http://localhost:4000/api/v1/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit feedback');
      }
      
      const data = await response.json();
      console.log(data);
      // Reset form and show success
      setSelectedJob('');
      setRating(0);
      setFeedback('');
      alert('Feedback submitted successfully!');
  
      // Refresh feedback history
      const historyResponse = await fetch(`http://localhost:4000/api/v1/reviews/history`, {
        method: 'GET',
        credentials: 'include',
      });
  
      if (!historyResponse.ok) {
        const errorData = await historyResponse.json();
        throw new Error(errorData.message || 'Failed to fetch feedback history');
      }
  
      const historyData = await historyResponse.json();
      const transformedHistory = historyData.data.map(item => ({
        id: item._id,
        jobTitle: item.jobId.title,
        rating: item.rating,
        feedback: item.feedback,
        freelancerName: item.freelancerId.name,
        date: new Date(item.createdAt).toLocaleDateString(),
      }));
      setFeedbackHistory(transformedHistory);
  
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError(error.message || 'Failed to submit feedback');
    }
  };
  

  const renderStarRating = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-6 h-6 cursor-pointer ${
          star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
        }`}
        onClick={() => setRating(star)}
      />
    ));
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B1724] to-[#2C3E50] p-6 flex items-center justify-center">
        <MessageSquareText className="mr-4 text-[#cae962]" size={40} />
        <h1 className="text-3xl font-bold text-white">Feedback & Review</h1>
      </div>
      <br />
      
      {/* Tabs */}
      <div className="mb-4 flex justify-center">
        <button 
          onClick={() => setActiveTab('provide')} 
          className={`mr-2 px-4 py-2 ${activeTab === 'provide' ? 'bg-[#cae962] text-[#0B1724] rounded font-bold shadow hover:shadow-lg hover:bg-gray-200 transition' : 'bg-gray-200 rounded hover:shadow-lg hover:bg-[#cae962] transition'}`}
        >
          Provide Feedback
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          className={`px-4 py-2 ${activeTab === 'history' ? 'bg-[#cae962] text-[#0B1724] rounded font-bold shadow hover:shadow-lg hover:bg-gray-200 transition' : 'bg-gray-200 rounded hover:shadow-lg hover:bg-[#cae962] transition'}`}
        >
          Feedback History
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      )}

      {activeTab === 'provide' && (
        <form onSubmit={handleSubmitFeedback} className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <div className="block">
            <label className="block mb-2 font-medium">Select Completed Job</label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select a job</option>
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div className="block">
            <br />
            <label className="block mb-2 font-medium">Rate Freelancer</label>
            <div className="flex space-x-2">
              {renderStarRating()}
            </div>
          </div>

          <div className="block">
            <br />
            <label className="block mb-2 font-medium">Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              className="w-full p-2 border rounded"
              rows="4"
              placeholder="Share your experience with the freelancer..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="bg-[#cae962] text-[#0B1724] px-4 py-2 rounded font-bold shadow hover:shadow-lg hover:bg-gray-200 transition"
          >
            Submit Feedback
          </button>
        </form>
      )}

      {activeTab === 'history' && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <MessageCircle className="mr-2" /> Feedback History
          </h2>
          {feedbackHistory.length > 0 ? (
            feedbackHistory.map((item) => (
              <div 
                key={item.id} 
                className="border-b last:border-b-0 py-4 hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">{item.jobTitle}</h3>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(item.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({item.rating})</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{item.feedback}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Freelancer: {item.freelancerName}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No feedback history available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RatingsFeedback;