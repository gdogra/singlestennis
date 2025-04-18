import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChallengeService } from '@/services/challengeService';

export default function CreateChallenge({ playerId, playerName, onClose }) {
  const [dates, setDates] = useState(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const challengeService = useChallengeService();
  const navigate = useNavigate();

  const handleDateChange = (index, value) => {
    const newDates = [...dates];
    newDates[index] = value;
    setDates(newDates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out empty dates
    const proposedDates = dates.filter(date => date.trim() !== '');
    
    if (proposedDates.length === 0) {
      setError('Please propose at least one date for the match');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { success, error } = await challengeService.createChallenge(playerId, proposedDates);
      
      if (!success) {
        throw new Error(error || 'Failed to create challenge');
      }
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        navigate('/challenges');
      }, 2000);
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
            <h3 className="text-lg font-medium text-gray-900">Challenge {playerName}</h3>
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
          
          {success ? (
            <div className="mt-4 rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Challenge sent successfully! Redirecting to challenges page...
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Propose up to 3 dates for your match
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    Suggest multiple dates to increase the chance of finding a time that works for both of you.
                  </p>
                </div>
                
                {dates.map((date, index) => (
                  <div key={index}>
                    <label htmlFor={`date-${index}`} className="block text-sm font-medium text-gray-700">
                      Option {index + 1}
                    </label>
                    <input
                      type="datetime-local"
                      id={`date-${index}`}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={date}
                      onChange={(e) => handleDateChange(index, e.target.value)}
                    />
                  </div>
                ))}
                
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  {loading ? 'Sending Challenge...' : 'Send Challenge'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
