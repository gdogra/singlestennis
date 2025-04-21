// File: src/App.jsx
import React from 'react';
import { Routes, Route, NavLink, Outlet } from 'react-router-dom';

import HomePage from './pages/Home.jsx';
import PlayerRankings from './pages/PlayerRankings.jsx';
import ProfilePage from './pages/Profile.jsx';
import ChallengesPage from './pages/Challenges.jsx';
import CalendarPage from './pages/Calendar.jsx';

export default function App() {
  return (
    <>
      {/* Navbar */}
      <nav className="p-6 bg-white shadow flex flex-wrap">
        <NavLink to="/" className="mr-6 hover:underline">SingleTennis</NavLink>
        <NavLink to="/leaderboard" className="mr-6 hover:underline">Leaderboard</NavLink>
        <NavLink to="/profile" className="mr-6 hover:underline">Profile</NavLink>
        <NavLink to="/challenges" className="mr-6 hover:underline">Challenges</NavLink>
        <NavLink to="/calendar" className="hover:underline">Calendar</NavLink>
      </nav>

      {/* Route Definitions */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="leaderboard" element={<PlayerRankings />} />
        <Route path="profile">
          <Route index element={<ProfilePage />} />
          <Route path=":id" element={<ProfilePage />} />
        </Route>
        <Route path="challenges" element={<ChallengesPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        {/* Fallback for 404 */}
        <Route path="*" element={<div className="p-6">Page not found</div>} />
      </Routes>

      {/* Nested routes outlet if needed in future layouts */}
      <Outlet />
    </>
  );
}

