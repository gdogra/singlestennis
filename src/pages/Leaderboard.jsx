// src/pages/Leaderboard.jsx
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function Leaderboard() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, avatar_url, wins, losses')
        .order('wins', { ascending: false })

      if (error) {
        console.error('Error fetching leaderboard:', error)
      } else {
        setPlayers(data)
      }
      setLoading(false)
    }

    fetchLeaderboard()
  }, [])

  if (loading) return <div className="p-4">Loading leaderboard...</div>

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <ul className="space-y-4">
        {players.map((player, index) => (
          <li
            key={player.id}
            className="flex items-center justify-between bg-white shadow rounded p-4"
          >
            <div className="flex items-center gap-4">
              <span className="font-bold text-lg w-6 text-gray-500">{index + 1}</span>
              <img
                src={player.avatar_url || '/default-avatar.png'}
                alt={player.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{player.name}</p>
                <p className="text-sm text-gray-500">
                  Wins: {player.wins ?? 0} | Losses: {player.losses ?? 0}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

