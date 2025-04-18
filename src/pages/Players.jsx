import { useState, useEffect } from 'react'
import { usePlayerService } from '@/services/playerService'
import PlayerDetail from '@/components/PlayerDetail'

export default function PlayerDirectory() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [skillFilter, setSkillFilter] = useState('all')
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [playerStats, setPlayerStats] = useState(null)
  const playerService = usePlayerService()
  
  useEffect(() => {
    fetchPlayers()
  }, [skillFilter])
  
  async function fetchPlayers() {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await playerService.getPlayers(skillFilter)
      
      if (error) throw new Error(error)
      
      setPlayers(data || [])
    } catch (error) {
      console.error('Error fetching players:', error.message)
      setError('Failed to load players. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handlePlayerClick = async (player) => {
    setSelectedPlayer(player)
    try {
      const { data } = await playerService.getPlayerStats(player.id)
      if (data) {
        setPlayerStats(data)
      }
    } catch (error) {
      console.error('Error fetching player stats:', error)
    }
  }

  const handleCloseDetail = () => {
    setSelectedPlayer(null)
    setPlayerStats(null)
  }
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Player Directory</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Find tennis players to challenge</p>
        </div>
        <div>
          <label htmlFor="skill-filter" className="sr-only">Filter by skill level</label>
          <select
            id="skill-filter"
            name="skill-filter"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
          >
            <option value="all">All Skill Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="px-4 py-5 sm:p-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="px-4 py-5 sm:p-6">
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </div>
      ) : players.length === 0 ? (
        <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
          No players found. Try adjusting your filter.
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {players.map((player) => (
            <li 
              key={player.id} 
              className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer"
              onClick={() => handlePlayerClick(player)}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  {player.avatar_url ? (
                    <img 
                      src={player.avatar_url} 
                      alt={player.full_name} 
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl text-gray-500">
                      {player.full_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">{player.full_name}</div>
                  <div className="text-sm text-gray-500 capitalize">{player.skill_level}</div>
                </div>
                <div className="ml-auto">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayerClick(player);
                    }}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedPlayer && (
        <PlayerDetail 
          player={{...selectedPlayer, ...playerStats}} 
          onClose={handleCloseDetail} 
        />
      )}
    </div>
  )
}
