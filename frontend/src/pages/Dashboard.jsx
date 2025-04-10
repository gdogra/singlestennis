// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ScheduledMatchesCalendar from "../components/ScheduledMatchesCalendar";
import axios from "axios";

const Dashboard = () => {
  const { user, token } = useAuth();
  const [ranking, setRanking] = useState(null);
  const [matches, setMatches] = useState([]);
  const [calendarRefreshKey, setCalendarRefreshKey] = useState(Date.now());

  useEffect(() => {
    if (!user || !token) return;

    const fetchData = async () => {
      try {
        const [rankingRes, matchesRes] = await Promise.all([
          axios.get("/api/dashboard/player-rankings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/matches/recent", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const playerRank = rankingRes.data.find(
          (p) => p.id === user.id
        );
        setRanking(playerRank?.rank || null);
        setMatches(matchesRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };

    fetchData();
  }, [user, token]);

  const handleCalendarRefresh = () => {
    setCalendarRefreshKey(Date.now());
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.first_name}</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Your Ranking</h2>
        <p className="text-lg">#{ranking ?? "-"}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Recent Matches</h2>
        {matches.length > 0 ? (
          <ul className="list-disc ml-6">
            {matches.map((match) => (
              <li key={match.id}>
                vs <strong>{match.opponent_name}</strong>: {match.result}
              </li>
            ))}
          </ul>
        ) : (
          <p>No matches found.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Scheduled Matches</h2>
        <ScheduledMatchesCalendar
          refreshKey={calendarRefreshKey}
          onReschedule={handleCalendarRefresh}
        />
      </div>
    </div>
  );
};

export default Dashboard;

