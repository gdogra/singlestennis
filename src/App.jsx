import React from 'react'
import { Routes, Route, Link, Outlet } from 'react-router-dom'

// import your pages:
import Home from './pages/Home'
import PlayerRankings from './pages/PlayerRankings'
import ProfilePage from './pages/Profile'
import ChallengesPage from './pages/Challenges'
import CalendarPage from './pages/Calendar'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* —————————————————————————————————————————————————————————————————————— */}
      {/* Navbar / shared header */}
      <nav className="bg-white shadow p-4">
        <ul className="flex space-x-6 container mx-auto">
          <li><Link to="/"      className="hover:underline">SingleTennis</Link></li>
          <li><Link to="/leaderboard" className="hover:underline">Leaderboard</Link></li>
          <li><Link to="/profile"     className="hover:underline">Profile</Link></li>
          <li><Link to="/challenges" className="hover:underline">Challenges</Link></li>
          <li><Link to="/calendar"    className="hover:underline">Calendar</Link></li>
        </ul>
      </nav>

      {/* —————————————————————————————————————————————————————————————————————— */}
      {/* Route outlet */}
      <main className="container mx-auto p-6">
        <Routes>

          {/* Home / Landing */}
          <Route path="/" element={<Home />} />

          {/* Leaderboard */}
          <Route path="leaderboard" element={<PlayerRankings />} />

          {/* Profile: default = your own; /profile/:id = any profile */}
          <Route path="profile" element={<Outlet />}>
            <Route index element={<ProfilePage />} />
            <Route path=":id" element={<ProfilePage />} />
          </Route>

          {/* Challenges */}
          <Route path="challenges" element={<ChallengesPage />} />

          {/* Calendar */}
          <Route path="calendar" element={<CalendarPage />} />

          {/* 404 fallback */}
          <Route path="*" element={<p className="text-center">Page not found</p>} />

        </Routes>
      </main>
    </div>
  )
}

