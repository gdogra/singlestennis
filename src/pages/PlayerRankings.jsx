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
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, avatar_url, skill_level')
          .order('skill_level', { ascending: false })
          .limit(10);

        if (error) throw error;
        setPlayers(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load player rankings.');
      } finally {
        setLoading(false);
      }
    }
    loadPlayers();
  }, []);

  if (loading) return <div className="p-6">Loading leaderboards…</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-6">
      <h1 className="text-4xl font-bold mb-6">Leaderboard</h1>
      <ul className="space-y-6">
        {players.map((p) => (
          <li key={p.id} className="flex items-center space-x-4">
            <img
              src={
                p.avatar_url ||
                `https://via.placeholder.com/64?text=${p.name[0]}`
              }
              alt={`${p.name}'s avatar`}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">{p.name}</h2>
              <p className="text-gray-500">Skill Level: {p.skill_level}</p>
            </div>
            <div className="w-48">
              <StatsChart skillLevel={p.skill_level} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

