import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: sessionData, error }) => {
      if (error || !sessionData?.session?.user) {
        navigate('/login');
      } else {
        setUser(sessionData.session.user);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const profileId = id || user.id;
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();
        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError('Profile not found.');
      }
    };
    fetchProfile();
  }, [user, id]);

  useEffect(() => {
    if (!profile) return;
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .or(`player1_id.eq.${profile.id},player2_id.eq.${profile.id}`)
        .order('played_at', { ascending: false });
      if (!error) setMatches(data);
    };
    fetchMatches();
  }, [profile]);

  if (!user || loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  const wins = matches.filter(m => m.winner_id === profile.id).length;
  const losses = matches.length - wins;

  return (
    <motion.div
      className="p-6 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold mb-4">Player Profile</h1>
      <div className="bg-white shadow-md rounded p-4 mb-6">
        <h2 className="text-xl font-semibold">{profile.name || 'Unnamed'}</h2>
        <p className="text-sm text-gray-600">Skill Level: {profile.skill_level || '—'}</p>
        <p className="text-sm text-gray-600">Email: {profile.email}</p>
        <div className="mt-3 text-sm">
          <span className="mr-6">🏆 Wins: <strong>{wins}</strong></span>
          <span>❌ Losses: <strong>{losses}</strong></span>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Match History</h3>
      {matches.length === 0 ? (
        <p className="text-gray-500 text-sm">No matches yet.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {matches.map(match => (
            <li key={match.id} className="border p-2 rounded">
              {new Date(match.played_at).toLocaleDateString()} —{' '}
              {match.winner_id === profile.id ? '✅ Won' : '❌ Lost'}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

