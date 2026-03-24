import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // If there is a user AND their role is exactly 'admin', render the page
  if (user && user.role === 'admin') {
    return children;
  }

  // Otherwise, kick them back to the homepage silently
  return <Navigate to="/" replace />;
};

export default AdminRoute;