import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const withAdminGuard = (Component) => {
  return (props) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />;
    if (user.role !== 'admin') return <Navigate to="/unauthorized" />;

    return <Component {...props} />;
  };
};

export default withAdminGuard;

