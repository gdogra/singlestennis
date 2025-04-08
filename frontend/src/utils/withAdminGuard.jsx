import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const withAdminGuard = (Component) => {
  return function GuardedComponent(props) {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />;
    if (user.role !== 'admin') return <Navigate to="/unauthorized" />;

    return <Component {...props} />;
  };
};

export default withAdminGuard;

