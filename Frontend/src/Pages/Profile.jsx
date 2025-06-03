import React, { useState, useEffect } from 'react';
import { UserPen } from 'lucide-react';
import { 
  User, 
  Lock, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  AlertTriangle 
} from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Client',
    avatar: 'zoro.png',
    profile: {
      bio: 'Need Web Developer for projects'
    }
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/v1/users/me', {
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

      const data = await response.json();
      setUserData(data.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile');
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/v1/users/me', {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      const data = await response.json();
      // Update local state with response data
      setUserData(data.data);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    }
  };

  const [success, setSuccess] = useState(null);

  const handleChangePassword = async () => {
    // Validate password fields
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      console.error('New passwords do not match');
      toast.error('New passwords do not match', {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Slide,
      });
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:4000/api/v1/auth/change-password`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Show success message
        toast.success(`Password changed successfully`, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
          transition: Slide,
        });
  
        // Reset state and close modal
        setIsChangingPassword(false);
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        // Handle API error
        console.error(data.message);
        throw new Error(data.message);
      }
    } catch (error) {
      // Show error message
      console.error('Error changing password', error);
      toast.error(`${error.message}`, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Slide,
      });
    }
  };
  
  

const SuccessMessage = () => {
  return success ? (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
      <span className="block sm:inline">{success}</span>
    </div>
  ) : null;
};


  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/v1/users/me', {
        method: 'DELETE',
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account');
      }
      
      // Logout user and redirect to login page
      localStorage.removeItem('token');
      window.location.href = '/login'; // Adjust redirect path as needed
    } catch (err) {
      console.error('Error deleting account:', err);
      setError(err.message || 'Failed to delete account');
    }
  };

  // Render error message if exists
  const ErrorMessage = () => {
    return error ? (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    ) : null;
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B1724] to-[#2C3E50] p-6 flex items-center justify-center">
        <UserPen className="mr-4 text-[#cae962]" size={40} />
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
      </div>
      <div className="bg-gray-50 p-2 flex justify-center">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl p-8 space-y-6">
          {/*Success and Error Message */}
          <SuccessMessage />
          <ErrorMessage />

          {/* Profile Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center space-x-4">
              <img 
                src={userData.avatar || 'zoro.png'} 
                alt="" 
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-500"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {userData.firstName} {userData.lastName}
                </h2>
                <p className="text-blue-600 font-semibold">{userData.role}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleEditProfile}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
              >
                <Edit size={20} />
              </button>
              <button 
                onClick={() => setIsChangingPassword(true)}
                className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
              >
                <Lock size={20} />
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <User className="mr-2 text-blue-500" /> Personal Information
              </h3>
              {isEditing ? (
                <div className="space-y-4">
                  <input 
                    type="text" 
                    value={userData.firstName}
                    onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="First Name"
                  />
                  <input 
                    type="text" 
                    value={userData.lastName}
                    onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Last Name"
                  />
                  <input 
                    type="email" 
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Email"
                  />
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleSaveProfile}
                      className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition flex items-center"
                    >
                      <Save className="mr-2" /> Save Changes
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition flex items-center"
                    >
                      <X className="mr-2" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p><strong>First Name:</strong> {userData.firstName}</p>
                  <p><strong>Last Name:</strong> {userData.lastName}</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Profile Details</h3>
              <div className="space-y-2">
                <p><strong>Role:</strong> Client</p>
                <p><strong>Bio:</strong> Need Web Developer</p>
              </div>
            </div>
          </div>

          {/* Password Change Modal */}
          {isChangingPassword && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Lock className="mr-2 text-blue-500" /> Change Password
                </h3>
                <div className="space-y-4">
                  <input 
                    type="password" 
                    placeholder="Old Password"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  <input 
                    type="password" 
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  <input 
                    type="password" 
                    placeholder="Confirm New Password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleChangePassword}
                      className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition flex items-center"
                    >
                      <Save className="mr-2" /> Change Password
                    </button>
                    <button 
                      onClick={() => setIsChangingPassword(false)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition flex items-center"
                    >
                      <X className="mr-2" /> Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Account Section */}
          <div className="border-t pt-4 flex justify-between items-center">
            <div className="flex items-center text-red-600">
              <AlertTriangle className="mr-2" />
              <p className="font-semibold">Danger Zone: Delete Account</p>
            </div>
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition flex items-center"
            >
              <Trash2 className="mr-2" /> Delete Account
            </button>
          </div>

          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md text-center">
                <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
                <h3 className="text-xl font-bold mb-4">Are you sure?</h3>
                <p className="mb-6">This action cannot be undone. All your data will be permanently deleted.</p>
                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={handleDeleteAccount}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                  >
                    Yes, Delete My Account
                  </button>
                  <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;