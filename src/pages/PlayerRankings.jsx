import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function PlayerRankings() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('skill_level', { ascending: false });

        if (error) throw error;
        setPlayers(data || []);
      } catch (err) {
        console.error('Error loading profiles:', err.message);
        setError('Failed to load leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">#</th>
              <th className="py-2">Player</th>
              <th className="py-2">Skill Level</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, i) => {
              const name = player.full_name ?? 'Unnamed';
              const initials =
                typeof name === 'string' && name.length > 0
                  ? name.charAt(0).toUpperCase()
                  : '?';
              return (
                <motion.tr
                  key={player.id}
                  className="border-b"
                  whileHover={{ scale: 1.01 }}
                >
                  <td className="py-2 px-2">{i + 1}</td>
                  <td className="py-2 px-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      {initials}
                    </div>
                    {name}
                  </td>
                  <td className="py-2 px-2">{player.skill_level ?? '—'}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      )}
    </motion.div>
  );
}

