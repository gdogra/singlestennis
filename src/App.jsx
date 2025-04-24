// src/App.jsx
import { useAuth } from './contexts/AuthContext.jsx'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Navbar from './components/Navbar.jsx'

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import Calendar from './pages/Calendar.jsx'
import Challenges from './pages/Challenges.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  const { session } = useAuth()

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/leaderboard" element={<Leaderboard />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={session ? <Profile user={session.user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/calendar"
          element={session ? <Calendar /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/challenges"
          element={session ? <Challenges /> : <Navigate to="/login" replace />}
        />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

