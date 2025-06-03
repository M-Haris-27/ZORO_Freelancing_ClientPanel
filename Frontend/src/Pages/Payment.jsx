import React, { useState, useEffect } from 'react';
import { DollarSign, FileText, CheckCircle } from 'lucide-react';

// API URL
const API_URL = 'http://localhost:4000/api/v1/payments';

const PaymentManagement = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('makePayment');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentForm, setPaymentForm] = useState({
    jobId: '',
    clientId: '',
    freelancerId: '',
    amount: 0
  });

  // Fetch payment history for the user when the component mounts
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/history`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        console.log(data);
        if (data.success) {
          // Fetch additional details like job, client, and freelancer for each payment
          const updatedPayments = await Promise.all(
            data.data.map(async (payment) => {
              // const jobResponse = await fetch(`http://localhost:4000/api/v1/jobs/${payment.jobId._id}`, {
              //   credentials: 'include'
              // });
              // const clientResponse = await fetch(`http://localhost:4000/api/v1/users/${payment.clientId._id}`, {
              //   credentials: 'include'
              // });
              // const freelancerResponse = await fetch(`http://localhost:4000/api/v1/users/${payment.freelancerId._id}`, {
              //   credentials: 'include'
              // });

              // const jobData = await jobResponse.json();
              // const clientData = await clientResponse.json();
              // const freelancerData = await freelancerResponse.json();

              return {
                ...payment,
                jobTitle: payment.jobId.title,
                clientFirstName: payment.clientId.email,
                freelancerFirstName: payment.freelancerId.email,
              };
            })
          );
          console.log(updatedPayments);
          setPaymentHistory(updatedPayments);
        } else {
          alert('No payment records found.');
        }
      } catch (error) {
        console.error('Error fetching payment history:', error);
        console.log('Failed to fetch payment history.');
      }
    };
    fetchPaymentHistory();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMakePayment = async (e) => {
    e.preventDefault();
    try {
      // Send the payment data to the backend
      const response = await fetch(API_URL, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentForm)
      });
      const data = await response.json();
      if (data.success) {
        alert('Payment processed successfully!');
        setPaymentHistory(prev => [...prev, data.data]); // Add new payment to the history
      } else {
        alert('Payment processing failed.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed.');
    }
  };

  const handleReleasePayment = async (paymentId) => {
    try {
      // Send the request to release the payment
      const response = await fetch(`${API_URL}/${paymentId}/release`, {
        method: 'PUT',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        alert('Payment released successfully!');
        setPaymentHistory(prev =>
          prev.map(payment =>
            payment._id === paymentId ? { ...payment, status: 'completed' } : payment
          )
        );
      } else {
        alert('Payment release failed.');
      }
    } catch (error) {
      console.error('Error releasing payment:', error);
      alert('Payment release failed.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B1724] to-[#2C3E50] p-6 flex items-center justify-center">
        <DollarSign className="mr-4 text-[#cae962]" size={40} />
        <h1 className="text-3xl font-bold text-white">Payment Management</h1>
      </div>
      <br />
      {/* Tabs */}
      <div className="mb-4 flex justify-center">
        <button 
          onClick={() => setActiveTab('makePayment')} 
          className={`mr-2 px-4 py-2 ${activeTab === 'makePayment' ? 'bg-[#cae962] text-[#0B1724] rounded font-bold shadow hover:shadow-lg' : 'bg-gray-200 rounded hover:shadow-lg hover:bg-[#cae962]'}`}
        >
          Make Payment
        </button>
        <button 
          onClick={() => setActiveTab('paymentHistory')} 
          className={`mr-2 px-4 py-2 ${activeTab === 'paymentHistory' ? 'bg-[#cae962] text-[#0B1724] rounded font-bold shadow hover:shadow-lg' : 'bg-gray-200 rounded hover:shadow-lg hover:bg-[#cae962]'}`}
        >
          Payment History
        </button>
      </div>

      {/* Make Payment Tab */}
      {activeTab === 'makePayment' && (
        <form onSubmit={handleMakePayment} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Job ID
              <input
                type="text"
                name="jobId"
                value={paymentForm.jobId}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Client ID
              <input
                type="text"
                name="clientId"
                value={paymentForm.clientId}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Freelancer ID
              <input
                type="text"
                name="freelancerId"
                value={paymentForm.freelancerId}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Amount
              <input
                type="number"
                name="amount"
                value={paymentForm.amount}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </label>
          </div>
          <button 
            type="submit" 
            className="bg-[#cae962] text-[#0B1724] font-bold py-2 px-4 rounded hover:bg-[#a6c050] focus:outline-none focus:shadow-outline"
          >
            Process Payment
          </button>
        </form>
      )}

      {/* Payment History Tab */}
      {activeTab === 'paymentHistory' && (
        <div className="bg-white shadow-md rounded">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="py-3 px-4 text-left">Job</th>
                <th className="py-3 px-4 text-left">Client</th>
                <th className="py-3 px-4 text-left">Freelancer</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr key={payment._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{payment.jobTitle}</td>
                  <td className="py-3 px-4">{payment.clientFirstName}</td>
                  <td className="py-3 px-4">{payment.freelancerFirstName}</td>
                  <td className="py-3 px-4 text-right">${payment.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <span 
                      className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}
                      `}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {payment.status === 'pending' && (
                      <button
                        onClick={() => handleReleasePayment(payment._id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Release Payment
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
