import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AuthProvider, { AuthContext } from './context/AuthContext';
import GoogleSignIn from './components/auth/GoogleSignIn';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import AdminPanel from './components/admin/AdminPanel';
import NotFound from './components/NotFound';

function AppRoutes() {
  const user = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
      <Route path="/login" element={<GoogleSignIn />} />
      <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

