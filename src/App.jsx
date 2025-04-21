// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';        // ← re‑add this import
import Home from './pages/Home';
import Profile from './pages/Profile';
import PlayerRankings from './pages/PlayerRankings';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      {/* Navbar restored here */}
      <Navbar />

      <div className="mt-16"> {/* optional top margin so content sits below a fixed Navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/leaderboard" element={<PlayerRankings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* other routes */}
        </Routes>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;

