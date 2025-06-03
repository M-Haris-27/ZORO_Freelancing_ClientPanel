import React, { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import {
  Briefcase,
  DollarSign,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Expanded data to be replaced with actual API data
const dashboardData = {
  jobPostings: {
    active: 1,
    total: 2,
    details: [
      { id: 1, title: 'Web Development', client: 'Abdul Moiz', status: 'in-progress', budget: '$5000', duration: 'short-term' },
    ]
  },
  projects: {
    ongoing: 1,
    completed: 1,
    details: [
      { id: 1, name: 'Zoro Platform', client: 'Abdul Moiz', progress: '75%', deadline: '8 June 2024' },
      { id: 2, name: 'Indrive app', client: 'Abdul Moiz', progress: '100%', deadline: '7 Dec 2024' },
    ]
  },
  budget: {
    allocated: 50000,
    spent: 8500,
    details: [
      { category: 'Development', allocated: 20000, spent: 3000, utilization: '15%' },
      { category: 'Design', allocated: 15000, spent: 2500, utilization: '17%' },
      { category: 'Management', allocated: 10000, spent: 2000, utilization: '20%' },
      { category: 'Marketing', allocated: 5000, spent: 1000, utilization: '20%' }
    ]
  },
  notifications: [
    { id: 1, type: 'project', message: 'New project "Web Redesign" assigned', status: 'info', read: false },
    { id: 2, type: 'budget', message: 'Budget threshold reached for Q2', status: 'alert', read: false },
    { id: 3, type: 'project', message: 'Project "Mobile App" completed', status: 'success', read: false }
  ]
};

const StatCard = ({ icon: Icon, title, value, subValue, color }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center">
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`${color} w-6 h-6`} />
        </div>
        <div className="text-right">
          <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
          <div className="flex flex-col">
            <p className="text-2xl font-bold">{value}</p>
            {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationList = () => {
  const [notifications, setNotifications] = useState(dashboardData.notifications);

  const markAsRead = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            p-3 mb-2 rounded-lg text-sm
            ${notification.status === 'alert' ? 'bg-red-50 text-red-800' :
            notification.status === 'success' ? 'bg-green-50 text-green-800' :
            'bg-blue-50 text-blue-800'}
            ${notification.read ? 'bg-opacity-60' : ''}
          `}
        >
          <div className="flex justify-between">
            <span>{notification.message}</span>
            <div className="flex space-x-2">
              <button
                className="px-2 py-1 text-xs text-black bg-[#cae962] rounded hover:bg-[#adc856]"
                onClick={() => markAsRead(notification.id)}
                disabled={notification.read}
              >
                {notification.read ? 'Read' : 'Mark as Read'}
              </button>
              <button
                className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                onClick={() => deleteNotification(notification.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
// Compare this snippet from client/src/Pages/Dashboard.jsx:
const DetailedInsights = () => {
  const [activeTab, setActiveTab] = useState('jobPostings');

  const renderDetails = () => {
    switch (activeTab) {
      case 'jobPostings':
        return (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Client</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Budget</th>
                <th className="p-2 text-left">Duration</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.jobPostings.details.map((job) => (
                <tr key={job.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{job.title}</td>
                  <td className="p-2">{job.client}</td>
                  <td className="p-2">{job.status}</td>
                  <td className="p-2">{job.budget}</td>
                  <td className="p-2">{job.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'projects':
        return (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Client</th>
                <th className="p-2 text-left">Progress</th>
                <th className="p-2 text-left">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.projects.details.map((project) => (
                <tr key={project.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{project.name}</td>
                  <td className="p-2">{project.client}</td>
                  <td className="p-2">{project.progress}</td>
                  <td className="p-2">{project.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'budget':
        return (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Allocated</th>
                <th className="p-2 text-left">Spent</th>
                <th className="p-2 text-left">Utilization</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.budget.details.map((budgetItem, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2">{budgetItem.category}</td>
                  <td className="p-2">${budgetItem.allocated}</td>
                  <td className="p-2">${budgetItem.spent}</td>
                  <td className="p-2">{budgetItem.utilization}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };
// Compare this snippet from client/src/Pages/Dashboard.jsx:
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Detailed Insights</h2>
      <div className="flex mb-4 space-x-2">
        {[{ key: 'jobPostings', label: 'Job Postings' },
          { key: 'projects', label: 'Projects' },
          { key: 'budget', label: 'Budget' }].map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-lg text-sm transition-colors
            ${activeTab === tab.key ? 'bg-[#cae962] text-[#0B1724] font-bold hover:shadow-lg hover:bg-[#abc653] transition' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {renderDetails()}
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B1724] to-[#2C3E50] p-6 flex items-center justify-center">
        <LayoutDashboard className="mr-4 text-[#cae962]" size={40} />
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Briefcase}
          title="Active Job Postings"
          value={dashboardData.jobPostings.active}
          subValue={`Total: ${dashboardData.jobPostings.total}`}
          color="text-blue-500"
        />
        <StatCard
          icon={CheckCircle}
          title="Project Status"
          value={dashboardData.projects.ongoing}
          subValue={`Completed: ${dashboardData.projects.completed}`}
          color="text-green-500"
        />
        <StatCard
          icon={DollarSign}
          title="Budget Insights"
          value={`$${(dashboardData.budget.spent / 1000).toFixed(1)}K`}
          subValue={`Allocated: $${(dashboardData.budget.allocated / 1000).toFixed(1)}K`}
          color="text-purple-500"
        />
        <StatCard
          icon={AlertCircle}
          title="Pending Actions"
          value={dashboardData.notifications.filter(n => n.status === 'alert').length}
          color="text-red-500"
        />
      </div>

      {/* Notifications and Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NotificationList />
        <DetailedInsights />
      </div>
    </div>
  );
};

export default Dashboard;
