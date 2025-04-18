import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateChallenge from '@/components/CreateChallenge'

export default function PlayerDetail({ player, onClose }) {
  const [showChallengeForm, setShowChallengeForm] = useState(false)
  const navigate = useNavigate()
  
  const handleChallengeClick = () => {
    setShowChallengeForm(true)
  }
  
  const handleChallengeClose = () => {
    setShowChallengeForm(false)
  }
  
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Player Profile</h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mt-4 flex items-center">
            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
              {player.avatar_url ? (
                <img 
                  src={player.avatar_url} 
                  alt={player.full_name} 
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl text-gray-500">
                  {player.full_name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="ml-4">
              <h4 className="text-xl font-bold text-gray-900">{player.full_name}</h4>
              <p className="text-sm text-gray-500 capitalize">{player.skill_level}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h5 className="text-sm font-medium text-gray-900">Stats</h5>
            <dl className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Matches</dt>
                <dd className="mt-1 text-sm text-gray-900">{player.matches_count || 0}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Win Rate</dt>
                <dd className="mt-1 text-sm text-gray-900">{player.win_rate || '0%'}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleChallengeClick}
          >
            Challenge to a Match
          </button>
        </div>
      </div>
      
      {showChallengeForm && (
        <CreateChallenge 
          playerId={player.id} 
          playerName={player.full_name} 
          onClose={handleChallengeClose} 
        />
      )}
    </div>
  )
}
