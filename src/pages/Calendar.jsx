// src/pages/Calendar.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import CalendarView from '../components/CalendarView'
import { useAuth } from '../contexts/AuthContext'

export default function Calendar() {
  const { user } = useAuth()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Match Calendar</h1>
      <p className="mb-4 text-gray-600">
        Logged in as <strong>{user?.email}</strong>
      </p>
      <CalendarView userId={user?.id} />
      <Link to="/challenges" className="mt-4 inline-block text-blue-600 underline">
        Go to Challenges →
      </Link>
    </div>
  )
}

