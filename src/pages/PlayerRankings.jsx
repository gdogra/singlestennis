// File: src/pages/PlayerRankings.jsx

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../supabaseClient';
import StatsChart from '../components/StatsChart';

export default function PlayerRankings() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlayers() {
      try {
        // Fetch only the fields that actually exist
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, avatar_url, skill_level');
        if (error) throw error;
        setPlayers(data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load player rankings.');
      } finally {
        setLoading(false);
      }
    }
    loadPlayers();
  }, []);

  if (loading) return <div className="p-6">Loading leaderboard…</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Leaderboard</h1>
      <div className="space-y-8">
        {players.map((p) => (
          <div key={p.id} className="flex flex-col items-center">
            <img
              src={
                p.avatar_url ||
                `https://via.placeholder.com/100?text=${encodeURIComponent(p.name[0])}`
              }
              alt={`${p.name}'s avatar`}
              className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
            />
            <h2 className="mt-2 text-xl font-semibold">{p.name}</h2>
            <p className="text-gray-600">Skill Level: {p.skill_level}</p>
            {/* You can replace StatsChart with your actual chart component */}
            <StatsChart playerId={p.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

