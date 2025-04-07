import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/admin/AdminPanel';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RequireRole from './components/auth/RequireRole';
import NotFound from './components/NotFound';
import Profile from './components/Profile';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<RequireRole role="admin"><AdminPanel /></RequireRole>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

