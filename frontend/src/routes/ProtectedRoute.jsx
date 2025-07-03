import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode to decode the token
import { useContext } from 'react';
import { UserContext } from '../context/UserContext'; // Import UserContext

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Get token from localStorage
  const { user } = useContext(UserContext); // Get user from context
  // const [loading, setLoading] = useState(true); // Loading state

  if (!token) {
    // If no token, redirect to login page
    return <Navigate to="/login" replace />;
  }

  try {
    // Decode the token to check its validity
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds

    if (decodedToken.exp && decodedToken.exp < currentTime) {
      // If token is expired, remove it and redirect to login
      localStorage.removeItem('token');
      return <Navigate to="/login" replace />;
    }
    
  } catch (error) {
    console.error('Invalid token:', error.message);
    // If token is invalid, remove it and redirect to login
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  // If token is valid, render the protected content
  return children;
};

export default ProtectedRoute;