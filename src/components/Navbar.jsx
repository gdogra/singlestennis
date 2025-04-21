import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function NavBar() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="bg-white shadow p-4">
      <nav className="container mx-auto flex items-center justify-between">
        <div className="space-x-4">
          <Link to="/" className="font-bold text-lg">SingleTennis</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/challenges">Challenges</Link>
          <Link to="/calendar">Calendar</Link>
        </div>
        <div>
          {!session ? (
            <Link to="/login">
              <button className="px-4 py-1 bg-blue-500 text-white rounded">
                Login
              </button>
            </Link>
          ) : (
            <button
              onClick={() => supabase.auth.signOut()}
              className="px-4 py-1 bg-gray-200 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}

