import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create UserContext
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Example of fetching user data after login (using token, etc.)
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/v1/user/me'); // API endpoint to get logged-in user info
        setUser(response.data); // Assuming response contains user data including clientId
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
