import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function PlayerRankings() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('skill_level', { ascending: false });

        if (error) throw error;
        setPlayers(data || []);
      } catch (err) {
        console.error('Error fetching rankings:', err.message);
        setError('Failed to load rankings.');
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) return <p>Loading rankings...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">#</th>
            <th className="py-2">Player</th>
            <th className="py-2">Skill Level</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => {
            const name = player.full_name ?? 'Unnamed';
            const initials = typeof name === 'string' && name.length > 0 ? name.charAt(0) : '?';
            const skill = player.skill_level ?? '—';

            return (
              <tr key={player.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-2">{index + 1}</td>
                <td className="py-2 px-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                    {initials}
                  </div>
                  <span>{name}</span>
                </td>
                <td className="py-2 px-2">{skill}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

