import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import LeaderboardPage from './pages/PlayerRankings'
import ProfilePage from './pages/Profile'
import ChallengesPage from './pages/Challenges'
import CalendarPage from './pages/Calendar'
import LoginPage from './pages/LoginPage'
import { ToastContainer } from 'react-toastify'

export default function App() {
  return (
    <>
      <NavBar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/profile/:id?" element={<ProfilePage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </>
  )
}

