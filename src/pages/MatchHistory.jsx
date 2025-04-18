import { useState, useEffect } from 'react';
import { useScoreService } from '@/services/scoreService';

export default function MatchHistory() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'won', 'lost'
  const scoreService = useScoreService();
  
  useEffect(() => {
    fetchMatchHistory();
  }, []);
  
  const fetchMatchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await scoreService.getCompletedMatches();
      
      if (error) throw new Error(error);
      
      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching match history:', error.message);
      setError('Failed to load match history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const getFilteredMatches = () => {
    if (filter === 'all') return matches;
    
    return matches.filter(match => {
      const isWinner = match.winner_id === match.user_id;
      return (filter === 'won' && isWinner) || (filter === 'lost' && !isWinner);
    });
  };
  
  const renderScores = (match) => {
    if (!match.scores || !Array.isArray(match.scores)) return 'No scores recorded';
    
    return match.scores.map((set, index) => (
      <span key={index} className="inline-block mx-1">
        {set.challenger}-{set.opponent}
        {index < match.scores.length - 1 ? ', ' : ''}
      </span>
    ));
  };
  
  const filteredMatches = getFilteredMatches();
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Match History</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            View your completed tennis matches
          </p>
        </div>
        <div>
          <label htmlFor="history-filter" className="sr-only">Filter matches</label>
          <select
            id="history-filter"
            name="history-filter"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Matches</option>
            <option value="won">Matches Won</option>
            <option value="lost">Matches Lost</option>
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
      ) : filteredMatches.length === 0 ? (
        <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
          No matches found. {filter !== 'all' ? 'Try changing the filter.' : ''}
        </div>
      ) : (
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {filteredMatches.map((match) => {
              const isChallenger = match.challenger.id === match.user_id;
              const opponent = isChallenger ? match.opponent : match.challenger;
              const isWinner = match.winner_id === match.user_id;
              
              return (
                <li key={match.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        {opponent.avatar_url ? (
                          <img 
                            src={opponent.avatar_url} 
                            alt={opponent.full_name} 
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xl text-gray-500">
                            {opponent.full_name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          vs {opponent.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(match.completed_at)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isWinner ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isWinner ? 'Won' : 'Lost'}
                      </span>
                      <div className="mt-1 text-sm text-gray-500">
                        {renderScores(match)}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
