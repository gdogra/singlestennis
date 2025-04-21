import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';

import HomePage from './pages/Home.jsx';
import PlayerRankings from './pages/PlayerRankings.jsx';
import ProfilePage from './pages/Profile.jsx';
import ChallengesPage from './pages/Challenges.jsx';
import CalendarPage from './pages/Calendar.jsx';

export default function App() {
  return (
    <>
      <nav className="p-6 bg-white shadow">
        <NavLink to="/" className="mr-6 hover:underline">SingleTennis</NavLink>
        <NavLink to="/leaderboard" className="mr-6 hover:underline">Leaderboard</NavLink>
        <NavLink to="/profile" className="mr-6 hover:underline">Profile</NavLink>
        <NavLink to="/challenges" className="mr-6 hover:underline">Challenges</NavLink>
        <NavLink to="/calendar" className="hover:underline">Calendar</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="leaderboard" element={<PlayerRankings />} />
        <Route path="profile/:id?" element={<ProfilePage />} />
        <Route path="challenges" element={<ChallengesPage />} />
        <Route path="calendar" element={<CalendarPage />} />
      </Routes>
    </>
  );
}

