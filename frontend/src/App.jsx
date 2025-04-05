import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import NotFound from './components/NotFound';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import GoogleSignIn from './components/auth/GoogleSignIn';
import AdminPanel from './components/admin/AdminPanel';
import Profile from './components/Profile';
import { AuthContext } from './context/AuthContext';

function App() {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="p-4">
          <Routes>
            <Route
              path="/"
              element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={isAuthenticated ? <Profile user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin"
              element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />}
            />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/google-signin" element={<GoogleSignIn />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

