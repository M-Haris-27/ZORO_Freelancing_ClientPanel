import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquare, Send, X } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyBK93Plf3Nua8wvVUslCFs2Dd-kyGxDfBo');

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/v1/users/me', {  // Update endpoint
        method: 'GET',
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  };

  // Fetch payment history
  const fetchPaymentHistory = async (userId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/payments/history/${userId}`, { // Update endpoint
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  };

  // Fetch job submissions
  const fetchJobSubmissions = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/v1/workSubmissions', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching job submissions:', error);
      return [];
    }
  };

  // Handle AI response generation
  const generateAIResponse = async (userMessage) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Gather context
      const userProfile = await fetchUserProfile();
      const paymentHistory = userProfile ? await fetchPaymentHistory(userProfile.data._id) : [];
      const jobSubmissions = await fetchJobSubmissions();

      // Prepare context for AI
      const context = JSON.stringify({
        userProfile: userProfile?.data,
        paymentHistory,
        jobSubmissions
      });

      const prompt = `
        You are a helpful assistant for a freelance platform. 
        Context: ${context}
        User Query: ${userMessage}
        
        Respond helpfully based on the context. If the query is about profile, payments, jobs, or submissions, use the provided context.
        If you don't have specific information, provide general guidance.
        Keep responses concise and professional.
      `;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('AI Response Error:', error);
      return "I'm having trouble processing your request. Could you please try again?";
    }
  };

  // Send message handler
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessages = [...messages, { text: inputMessage, sender: 'user' }];
    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);

    try {
      const aiResponse = await generateAIResponse(inputMessage);
      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "I'm sorry, I couldn't process your request.",
        sender: 'ai' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add default AI message when chat is opened
  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      setMessages([{ sender: 'ai', text: 'Hello! How can I assist you today?' }]);
    }
  }, [isChatOpen, messages.length]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B1724] to-[#2C3E50] p-6 flex items-center justify-center">
          <MessageSquare className="mr-4 text-[#cae962]" size={40} />
          <h1 className="text-3xl font-bold text-white">ZORO Chatbot Support</h1>
        </div>

        {/* Main Content */}
        <div className="p-8 grid md:grid-cols-2 gap-8 items-center">
          {/* Support Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-[#0B1724]">AI Assistant Support</h2>
            <div className="space-y-4 text-gray-700">
              <p>Our AI Assistant is here to help you navigate the platform, answer questions, and provide instant support.</p>
              
              <div className="bg-[#cae962] bg-opacity-20 p-4 rounded-lg border-l-4 border-[#cae962]">
                <h3 className="font-bold mb-2">What Can I Help You With?</h3>
                <ul className="list-disc list-inside text-sm">
                  <li>Account and Profile Queries</li>
                  <li>Payment and Billing Information</li>
                  <li>Job Submissions and Status</li>
                  <li>Platform Navigation Guidance</li>
                  <li>General Platform Support</li>
                </ul>
              </div>

              <p>Click on the chat icon in the bottom right corner to start a conversation with our AI Assistant.</p>
            </div>
          </div>

          {/* Visual Guidance */}
          <div className="relative flex justify-center items-center">
            <div className="bg-gray-100 rounded-lg p-8 text-center relative">
              <div className="absolute -top-4 -right-4 animate-bounce">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="80" 
                  height="80" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#cae962" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </div>
              <MessageSquare 
                size={100} 
                className="mx-auto text-[#0B1724] opacity-50 mb-4"
              />
              <p className="text-gray-700 font-medium">
                Your AI Assistant is always ready to help
              </p>
            </div>
          </div>
        </div>

        {/* Chatbot Trigger Button */}
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 bg-[#cae962] text-[#0B1724] p-4 rounded-full shadow-2xl hover:bg-[#a6c050] transition"
          >
            <MessageSquare size={24} />
          </button>
        )}

        {/* Chatbot Window */}
        {isChatOpen && (
          <div className="w-96 h-[500px] bg-white shadow-2xl rounded-2xl flex flex-col border border-gray-200 fixed bottom-11 right-11">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-[#0B1724] to-[#2C3E50] p-4 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-white font-bold">ZORO AI Assistant</h2>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`
                      max-w-[80%] p-3 rounded-xl
                      ${message.sender === 'user' 
                        ? 'bg-[#cae962] text-[#0B1724]' 
                        : 'bg-gray-100 text-gray-800'}
                    `}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-xl">
                    Typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t flex items-center">
              <input 
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-grow p-2 border rounded-l-lg focus:outline-none"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-[#cae962] text-[#0B1724] p-2 rounded-r-lg hover:bg-[#a6c050]"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
