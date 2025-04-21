import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import ChallengeModal from '../components/ChallengeModal';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setIsOwnProfile(!id || id === user.id);

      const profileId = id || user.id;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (error) {
        console.error('Error loading profile:', error.message);
      } else {
        setProfile(data);
      }
    };

    const fetchMatchHistory = async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .or(`player1_id.eq.${id},player2_id.eq.${id}`)
        .order('played_at', { ascending: false });

      if (!error) setMatches(data);
    };

    fetchProfile();
    if (id) fetchMatchHistory();
  }, [id]);

  if (!profile) return <p className="p-4">Loading profile...</p>;

  const initials = profile.name?.charAt(0).toUpperCase() || '?';
  const avatarUrl = profile.avatar_url;

  return (
    <motion.div
      className="p-6 max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
              {initials}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-sm text-gray-600">{profile.location || 'No location set'}</p>
            <p className="text-sm text-gray-600 italic">{profile.bio || 'No bio available.'}</p>
          </div>
        </div>

        {!isOwnProfile && (
          <div className="mt-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowChallengeModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Challenge Player
            </motion.button>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Recent Matches</h3>
        {matches.length === 0 ? (
          <p className="text-gray-500">No match history yet.</p>
        ) : (
          <ul className="divide-y">
            {matches.map((m) => (
              <li key={m.id} className="py-2">
                Match on {new Date(m.played_at).toLocaleDateString()} — Score: {m.score}
              </li>
            ))}
          </ul>
        )}
      </div>

      {showChallengeModal && (
        <ChallengeModal
          targetId={profile.id}
          onClose={() => setShowChallengeModal(false)}
        />
      )}
    </motion.div>
  );
}

