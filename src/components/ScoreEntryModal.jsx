import { useState } from 'react';
import { useScoreService } from '@/services/scoreService';

export default function ScoreEntryModal({ match, onClose, onSuccess }) {
  const [scores, setScores] = useState([
    { challenger: '', opponent: '' },
    { challenger: '', opponent: '' },
    { challenger: '', opponent: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSet, setActiveSet] = useState(0);
  const scoreService = useScoreService();

  const handleScoreChange = (set, player, value) => {
    // Validate that the score is a number between 0 and 7
    if (value !== '' && (isNaN(value) || value < 0 || value > 7)) {
      return;
    }

    const newScores = [...scores];
    newScores[set][player] = value;
    setScores(newScores);
  };

  const determineWinner = () => {
    let challengerSets = 0;
    let opponentSets = 0;

    for (const set of scores) {
      if (set.challenger === '' || set.opponent === '') continue;
      
      const challengerScore = parseInt(set.challenger);
      const opponentScore = parseInt(set.opponent);
      
      if (challengerScore > opponentScore) {
        challengerSets++;
      } else if (opponentScore > challengerScore) {
        opponentSets++;
      }
    }

    if (challengerSets > opponentSets) {
      return match.challenger.id;
    } else if (opponentSets > challengerSets) {
      return match.opponent.id;
    }
    
    return null; // Tie (should not happen in tennis)
  };

  const validateScores = () => {
    // Check if at least one set has complete scores
    let hasCompleteSet = false;
    
    for (const set of scores) {
      if (set.challenger !== '' && set.opponent !== '') {
        hasCompleteSet = true;
        
        // Validate that the scores make sense for tennis
        const challengerScore = parseInt(set.challenger);
        const opponentScore = parseInt(set.opponent);
        
        // In tennis, one player must have at least 6 games to win a set
        // and must be ahead by at least 2 games (unless it's 7-6)
        const isValidSet = 
          (challengerScore >= 6 && challengerScore - opponentScore >= 2) ||
          (opponentScore >= 6 && opponentScore - challengerScore >= 2) ||
          (challengerScore === 7 && opponentScore === 6) ||
          (challengerScore === 6 && opponentScore === 7);
        
        if (!isValidSet) {
          setError('Invalid set score. In tennis, one player must have at least 6 games to win a set and must be ahead by at least 2 games (unless it\'s 7-6).');
          return false;
        }
      }
    }
    
    if (!hasCompleteSet) {
      setError('Please enter scores for at least one complete set.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateScores()) {
      return;
    }
    
    const winnerId = determineWinner();
    if (!winnerId) {
      setError('Could not determine a winner from the scores.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Filter out empty sets
      const validScores = scores.filter(set => set.challenger !== '' && set.opponent !== '');
      
      const { success, error } = await scoreService.submitMatchScore(
        match.id,
        validScores,
        winnerId
      );
      
      if (!success) {
        throw new Error(error || 'Failed to submit scores');
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Enter Match Scores</h3>
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
          
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Match between {match.challenger.full_name} and {match.opponent.full_name}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Played on: {new Date(match.scheduled_date).toLocaleDateString()}
            </p>
            
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="space-y-4">
                <div className="flex space-x-4">
                  {[0, 1, 2].map((setIndex) => (
                    <button
                      key={setIndex}
                      type="button"
                      className={`px-3 py-1 text-sm font-medium rounded-md ${
                        activeSet === setIndex
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      onClick={() => setActiveSet(setIndex)}
                    >
                      Set {setIndex + 1}
                    </button>
                  ))}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-3 gap-4">
                    <div></div>
                    <div className="text-center text-sm font-medium text-gray-700">Games</div>
                    <div></div>
                    
                    <div className="text-right text-sm font-medium text-gray-700">
                      {match.challenger.full_name}
                    </div>
                    <div>
                      <input
                        type="text"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-center"
                        value={scores[activeSet].challenger}
                        onChange={(e) => handleScoreChange(activeSet, 'challenger', e.target.value)}
                        placeholder="0-7"
                      />
                    </div>
                    <div></div>
                    
                    <div className="text-right text-sm font-medium text-gray-700">
                      {match.opponent.full_name}
                    </div>
                    <div>
                      <input
                        type="text"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-center"
                        value={scores[activeSet].opponent}
                        onChange={(e) => handleScoreChange(activeSet, 'opponent', e.target.value)}
                        placeholder="0-7"
                      />
                    </div>
                    <div></div>
                  </div>
                </div>
                
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Scores'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
