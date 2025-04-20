import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SharedLayout from '../layouts/SharedLayout';
import PlayerRankings from './pages/PlayerRankings';
import Challenges from './pages/Challenges';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<PlayerRankings />} />
          <Route path="leaderboard" element={<PlayerRankings />} />
          <Route path="challenges" element={<Challenges />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

