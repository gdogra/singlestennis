// src/components/Navbar.jsx
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b">
      <div className="font-bold text-xl">
        <Link to="/">SingleTennis</Link>
      </div>
      <div className="space-x-4">
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/challenges">Challenges</Link>
        <Link to="/calendar">Calendar</Link>
        {user ? (
          <button onClick={signOut} className="ml-4 text-red-600 font-medium">
            Logout
          </button>
        ) : (
          <Link to="/login" className="ml-4 font-medium">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

