import React from 'react'
import { Routes, Route, Link, Outlet } from 'react-router-dom'

// your pages
import Home from './pages/Home'
import PlayerRankings from './pages/PlayerRankings'
import ProfilePage from './pages/Profile'
import ChallengesPage from './pages/Challenges'
import CalendarPage from './pages/Calendar'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white shadow">
        <ul className="container mx-auto flex space-x-6 p-4">
          <li><Link to="/" className="hover:underline">SingleTennis</Link></li>
          <li><Link to="/leaderboard" className="hover:underline">Leaderboard</Link></li>
          <li><Link to="/profile" className="hover:underline">Profile</Link></li>
          <li><Link to="/challenges" className="hover:underline">Challenges</Link></li>
          <li><Link to="/calendar" className="hover:underline">Calendar</Link></li>
        </ul>
      </nav>

      {/* Main Outlet */}
      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="leaderboard" element={<PlayerRankings />} />

          <Route path="profile" element={<Outlet />}>
            <Route index element={<ProfilePage />} />
            <Route path=":id" element={<ProfilePage />} />
          </Route>

          <Route path="challenges" element={<ChallengesPage />} />

          <Route path="calendar" element={<CalendarPage />} />

          <Route path="*" element={<p className="text-center">404: Not Found</p>} />
        </Routes>
      </main>
    </div>
  )
}

