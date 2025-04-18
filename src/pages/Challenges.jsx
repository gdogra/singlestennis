import { useState, useEffect } from 'react';
import { useChallengeService } from '@/services/challengeService';
import CreateChallenge from '@/components/CreateChallenge';
import { useAuth } from '@/contexts/AuthContext';

export default function ChallengeList() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [responseLoading, setResponseLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const challengeService = useChallengeService();
  const { user } = useAuth();

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await challengeService.getChallenges();
      
      if (error) throw new Error(error);
      
      setChallenges(data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error.message);
      setError('Failed to load challenges. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (challenge) => {
    try {
      setResponseLoading(true);
      
      // If there are multiple proposed dates, show date selection
      if (challenge.proposed_dates && challenge.proposed_dates.length > 1) {
        setSelectedChallenge(challenge);
        return;
      }
      
      // If there's only one date, accept with that date
      const selectedDate = challenge.proposed_dates && challenge.proposed_dates.length === 1 
        ? challenge.proposed_dates[0] 
        : null;
      
      const { success, error } = await challengeService.respondToChallenge(
        challenge.id, 
        'accepted',
        selectedDate
      );
      
      if (!success) throw new Error(error);
      
      // Refresh challenges list
      fetchChallenges();
    } catch (error) {
      console.error('Error accepting challenge:', error.message);
      setError('Failed to accept challenge. Please try again later.');
    } finally {
      setResponseLoading(false);
    }
  };

  const handleDecline = async (challengeId) => {
    try {
      setResponseLoading(true);
      
      const { success, error } = await challengeService.respondToChallenge(
        challengeId, 
        'declined'
      );
      
      if (!success) throw new Error(error);
      
      // Refresh challenges list
      fetchChallenges();
    } catch (error) {
      console.error('Error declining challenge:', error.message);
      setError('Failed to decline challenge. Please try again later.');
    } finally {
      setResponseLoading(false);
    }
  };

  const confirmDateSelection = async () => {
    if (!selectedChallenge || !selectedDate) return;
    
    try {
      setResponseLoading(true);
      
      const { success, error } = await challengeService.respondToChallenge(
        selectedChallenge.id, 
        'accepted',
        selectedDate
      );
      
      if (!success) throw new Error(error);
      
      // Close modal and refresh challenges
      setSelectedChallenge(null);
      setSelectedDate('');
      fetchChallenges();
    } catch (error) {
      console.error('Error accepting challenge with date:', error.message);
      setError('Failed to accept challenge. Please try again later.');
    } finally {
      setResponseLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const isChallenger = (challenge) => {
    return challenge.challenger_id === user?.id;
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Challenges</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          View and manage your tennis match challenges
        </p>
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
      ) : challenges.length === 0 ? (
        <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
          No challenges found. Visit the player directory to challenge someone to a match!
        </div>
      ) : (
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  {isChallenger(challenge) ? 'You challenged' : 'Challenge from'}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">
                        {isChallenger(challenge) 
                          ? challenge.opponent.full_name 
                          : challenge.challenger.full_name}
                      </span>
                      <div className="mt-1">
                        <span className="text-xs text-gray-500">Status: </span>
                        <span className={`text-xs font-medium ${
                          challenge.status === 'pending' ? 'text-yellow-600' :
                          challenge.status === 'accepted' ? 'text-green-600' :
                          'text-red-600'
                        }`}>
                          {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Proposed dates:</span>
                        <ul className="mt-1 text-xs text-gray-700">
                          {challenge.proposed_dates && challenge.proposed_dates.map((date, index) => (
                            <li key={index}>{formatDate(date)}</li>
                          ))}
                        </ul>
                      </div>
                      {challenge.scheduled_date && (
                        <div className="mt-2">
                          <span className="text-xs font-medium text-green-600">
                            Match scheduled for: {formatDate(challenge.scheduled_date)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {!isChallenger(challenge) && challenge.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          onClick={() => handleAccept(challenge)}
                          disabled={responseLoading}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => handleDecline(challenge.id)}
                          disabled={responseLoading}
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      
      {selectedChallenge && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Select Match Date</h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setSelectedChallenge(null)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Choose one of the proposed dates:
                </label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  <option value="">Select a date</option>
                  {selectedChallenge.proposed_dates && selectedChallenge.proposed_dates.map((date, index) => (
                    <option key={index} value={date}>
                      {formatDate(date)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setSelectedChallenge(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={confirmDateSelection}
                  disabled={!selectedDate || responseLoading}
                >
                  {responseLoading ? 'Confirming...' : 'Confirm Date'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
