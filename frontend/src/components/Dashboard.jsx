// frontend/src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ScheduledMatchesCalendar from "./ScheduledMatchesCalendar";
import { getRecentMatches, getPlayerRank } from "../api";

const Dashboard = () => {
  const { user } = useAuth();
  const [recentMatches, setRecentMatches] = useState([]);
  const [rank, setRank] = useState(null);
  const [calendarKey, setCalendarKey] = useState(Date.now());

  useEffect(() => {
    if (!user) return;
    const fetchDashboardData = async () => {
      try {
        const rankRes = await getPlayerRank(user.id);
        setRank(rankRes?.ranking ?? "-");

        const matchRes = await getRecentMatches(user.id);
        setRecentMatches(matchRes || []);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchDashboardData();
  }, [user]);

  const refreshCalendar = () => setCalendarKey(Date.now());

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.first_name}</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Your Ranking</h2>
        <p className="text-lg text-gray-700">#{rank}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Recent Matches</h2>
        {recentMatches.length === 0 ? (
          <p className="text-gray-500">No matches found.</p>
        ) : (
          <ul className="list-disc pl-5">
            {recentMatches.map((match, i) => (
              <li key={i}>
                vs <strong>{match.opponent_name}</strong>:{" "}
                {match.result} ({match.score})
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Scheduled Matches</h2>
        <ScheduledMatchesCalendar key={calendarKey} userId={user?.id} />
        <button
          onClick={refreshCalendar}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </section>
    </div>
  );
};

export default Dashboard;

