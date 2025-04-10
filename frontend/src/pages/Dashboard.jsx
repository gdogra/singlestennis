// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [ranking, setRanking] = useState(null);
  const [recentMatches, setRecentMatches] = useState([]);
  const [scheduledMatches, setScheduledMatches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [rankingRes, recentRes, scheduledRes] = await Promise.all([
          fetch('/api/dashboard/player-rankings', { headers }),
          fetch('/api/matches/recent', { headers }),
          fetch('/api/matches/scheduled', { headers }),
        ]);

        const [rankingData, recentData, scheduledData] = await Promise.all([
          rankingRes.json(),
          recentRes.json(),
          scheduledRes.json(),
        ]);

        setRanking(rankingData.find((r) => r.email === user.email) || null);
        setRecentMatches(recentData);
        setScheduledMatches(scheduledData);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    };

    fetchData();
  }, [user.email, token]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.email} 👋</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Ranking</h2>
        <p className="text-lg">{ranking ? `#${ranking.rank}` : 'Not ranked yet'}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Recent Matches</h2>
        {recentMatches.length > 0 ? (
          <ul className="space-y-2">
            {recentMatches.map((match) => (
              <li
                key={match.id}
                className="border p-3 rounded shadow flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold">{match.opponent_name}</div>
                  <div className="text-sm text-gray-600">
                    {formatDate(match.date)} • Score: {match.score || 'N/A'}
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                  Completed
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent matches found.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Scheduled Matches</h2>
        {scheduledMatches.length > 0 ? (
          <ul className="space-y-2">
            {scheduledMatches.map((match) => (
              <li
                key={match.id}
                className="border p-3 rounded shadow flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold">{match.opponent_name}</div>
                  <div className="text-sm text-gray-600">
                    {formatDate(match.date)} • Location: {match.location || 'TBD'}
                  </div>
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                  Scheduled
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No upcoming matches scheduled.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;

