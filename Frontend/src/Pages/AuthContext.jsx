import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [clientId, setClientId] = useState(null);
  
  useEffect(() => {
    const fetchClientId = async () => {
      try {
        // Fetch clientId from backend API or localStorage (depending on your implementation)
        const response = await axios.get('http://localhost:4000/api/v1/user/me');
        setClientId(response.data.clientId);
      } catch (error) {
        console.error('Error fetching client ID:', error); //incase of error
      }
    };

    fetchClientId();
  }, []);

  return (
    <AuthContext.Provider value={{ clientId }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
