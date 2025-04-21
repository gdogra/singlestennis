// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import PlayerRankings from './pages/PlayerRankings';
import Dashboard from './pages/Dashboard';
import ChallengesPage from './pages/Challenges';
import CalendarPage from './pages/Calendar';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="mt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/leaderboard" element={<PlayerRankings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </Router>
  );
}

export default App;
