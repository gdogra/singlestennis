// src/pages/Players.jsx
import React, { useState, useEffect } from 'react'
import { getPlayers } from '../services/playerService'

export default function Players() {
  const [players, setPlayers] = useState([])
  const [skillFilter, setSkillFilter] = useState('all')
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getPlayers(skillFilter === 'all' ? null : skillFilter)
        setPlayers(data)
      } catch (e) {
        console.error(e)
        setError('Failed to load players. Please try again later.')
      }
    }
    fetch()
  }, [skillFilter])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Player Directory</h1>
      <p className="mb-2">Find tennis players to challenge</p>
      <div className="mb-4">
        <select
          className="border px-2 py-1"
          value={skillFilter}
          onChange={e => setSkillFilter(e.target.value)}
        >
          <option value="all">All Skill Levels</option>
          <option value="3.6">3.6</option>
          <option value="4.0">4.0</option>
          <option value="4.5">4.5</option>
          <option value="5.0">5.0</option>
          <option value="6.0">6.0</option>
        </select>
      </div>

      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <ul className="space-y-2">
          {players.map(player => (
            <li
              key={player.id}
              className="border p-2 rounded hover:shadow transition"
            >
              <span className="font-semibold">{player.name}</span>{' '}
              <span className="text-sm text-gray-600">
                ({player.skill_level})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

