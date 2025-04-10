// frontend/src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Simulate async check or delay
    const timeout = setTimeout(() => {
      if (!user) {
        console.warn('🚫 Access denied: user not logged in');
        setAuthorized(false);
      } else if (requiredRole && user.role !== requiredRole) {
        console.warn(`🚫 Access denied: role "${user.role}" does not match required "${requiredRole}"`);
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }
      setCheckingAuth(false);
    }, 500); // simulate loading delay

    return () => clearTimeout(timeout);
  }, [user, requiredRole]);

  if (checkingAuth) {
    return (
      <div className="p-10 text-center">
        <div className="animate-pulse text-lg">🔐 Checking access...</div>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to={!user ? "/login" : "/unauthorized"} />;
  }

  return children;
};

export default ProtectedRoute;

