import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function PlayerRankings() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlayers() {
      try {
        const res = await fetch('/api/players');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setPlayers(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load leaderboard.');
      } finally {
        setLoading(false);
      }
    }
    loadPlayers();
  }, []);

  if (loading) return <div className="p-6">Loading leaderboard…</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {players.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center"
          >
            <img
              src={
                p.avatar_url ||
                `https://via.placeholder.com/100?text=${p.name[0]}`
              }
              alt={`${p.name}'s avatar`}
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-400 mb-4"
            />
            <h2 className="text-xl font-semibold mb-1">{p.name}</h2>
            <p className="text-gray-600">
              Skill Level: <span className="font-medium">{p.skill_level}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

