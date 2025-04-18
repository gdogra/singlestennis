import { useState, useEffect } from 'react';
import { useCalendarService } from '@/services/calendarService';
import ScoreEntryModal from '@/components/ScoreEntryModal';

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rescheduleMatch, setRescheduleMatch] = useState(null);
  const [scoreEntryMatch, setScoreEntryMatch] = useState(null);
  const [newDate, setNewDate] = useState('');
  const calendarService = useCalendarService();

  useEffect(() => {
    fetchMatches();
  }, [currentMonth]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Calculate start and end dates for the current month view
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      // Format dates for API
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();
      
      const { data, error } = await calendarService.getMatches(formattedStartDate, formattedEndDate);
      
      if (error) throw new Error(error);
      
      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching matches:', error.message);
      setError('Failed to load matches. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleRescheduleClick = (match) => {
    setRescheduleMatch(match);
    // Initialize with current scheduled date
    setNewDate(match.scheduled_date.substring(0, 16)); // Format for datetime-local input
  };

  const handleScoreEntryClick = (match) => {
    setScoreEntryMatch(match);
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleMatch || !newDate) return;
    
    try {
      setLoading(true);
      
      const { success, error } = await calendarService.rescheduleMatch(
        rescheduleMatch.id, 
        newDate
      );
      
      if (!success) throw new Error(error);
      
      // Close modal and refresh matches
      setRescheduleMatch(null);
      setNewDate('');
      fetchMatches();
    } catch (error) {
      console.error('Error rescheduling match:', error.message);
      setError('Failed to reschedule match. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreSubmitSuccess = () => {
    fetchMatches();
  };

  // Calendar generation helpers
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 bg-gray-50"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      
      // Find matches for this day
      const matchesForDay = matches.filter(match => {
        const matchDate = new Date(match.scheduled_date);
        return matchDate.getDate() === day && 
               matchDate.getMonth() === month && 
               matchDate.getFullYear() === year;
      });
      
      days.push(
        <div 
          key={day} 
          className={`h-24 border border-gray-200 p-2 ${
            dateString === selectedDate ? 'bg-indigo-50' : ''
          }`}
          onClick={() => handleDateClick(dateString)}
        >
          <div className="font-medium text-sm">{day}</div>
          <div className="mt-1 space-y-1">
            {matchesForDay.map(match => (
              <div 
                key={match.id} 
                className="text-xs bg-indigo-100 p-1 rounded truncate cursor-pointer hover:bg-indigo-200"
                onClick={(e) => {
                  e.stopPropagation();
                  // Check if the match date is today or in the past
                  const matchDate = new Date(match.scheduled_date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  
                  if (matchDate <= today) {
                    // If match is today or in the past, allow score entry
                    handleScoreEntryClick(match);
                  } else {
                    // If match is in the future, allow rescheduling
                    handleRescheduleClick(match);
                  }
                }}
              >
                {new Date(match.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {' vs '}
                {match.challenger.id === match.user_id ? match.opponent.full_name : match.challenger.full_name}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Match Calendar</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          View and manage your scheduled tennis matches
        </p>
      </div>
      
      {loading && !rescheduleMatch && !scoreEntryMatch ? (
        <div className="px-4 py-5 sm:p-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="px-4 py-5 sm:p-6">
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </div>
      ) : (
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handlePrevMonth}
            >
              Previous
            </button>
            <h2 className="text-xl font-semibold text-gray-900">{formatMonth(currentMonth)}</h2>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleNextMonth}
            >
              Next
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-px">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium py-2 bg-gray-50">{day}</div>
            ))}
            {renderCalendarDays()}
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>• Click on a match to enter scores (past matches) or reschedule (future matches)</p>
          </div>
        </div>
      )}
      
      {rescheduleMatch && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Reschedule Match</h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setRescheduleMatch(null)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Match with {rescheduleMatch.challenger.id === rescheduleMatch.user_id ? 
                    rescheduleMatch.opponent.full_name : 
                    rescheduleMatch.challenger.full_name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Currently scheduled for: {new Date(rescheduleMatch.scheduled_date).toLocaleString()}
                </p>
                
                <div className="mt-4">
                  <label htmlFor="new-date" className="block text-sm font-medium text-gray-700">
                    New date and time
                  </label>
                  <input
                    type="datetime-local"
                    id="new-date"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setRescheduleMatch(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={handleRescheduleSubmit}
                  disabled={!newDate || loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {scoreEntryMatch && (
        <ScoreEntryModal 
          match={scoreEntryMatch} 
          onClose={() => setScoreEntryMatch(null)} 
          onSuccess={handleScoreSubmitSuccess}
        />
      )}
    </div>
  );
}
