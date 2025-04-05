import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoogleSignIn from './components/auth/GoogleSignIn';
import Dashboard from './components/dashboard/Dashboard';
import NotFound from './components/NotFound';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<GoogleSignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

