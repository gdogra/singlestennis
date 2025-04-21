// src/pages/Profile.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../supabaseClient';
import ChallengeModal from '../components/ChallengeModal';

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // fetch current user
        const {
          data: { user },
          error: userErr,
        } = await supabase.auth.getUser();
        if (userErr) throw userErr;
        const profileId = id || user.id;

        // only valid profile fields
        const { data: profData, error: profErr } = await supabase
          .from('profiles')
          .select('id, name, avatar_url, skill_level')
          .eq('id', profileId)
          .single();
        if (profErr) throw profErr;
        setProfile(profData);

        // select only the ID columns that exist
        const { data: matchData, error: matchErr } = await supabase
          .from('matches')
          .select('id, player1_id, player2_id, winner_id, played_at')
          .or(`player1_id.eq.${profileId},player2_id.eq.${profileId}`)
          .order('played_at', { ascending: false });
        if (matchErr) throw matchErr;
        setMatches(matchData || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load profile or matches.');
      }
    }
    loadData();
  }, [id]);

  if (!profile) return <div className="p-6">Loading profile…</div>;

  const wins = matches.filter((m) => m.winner_id === profile.id).length;
  const losses = matches.length - wins;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center">
        <img
          src={
            profile.avatar_url ||
            `https://via.placeholder.com/150?text=${encodeURIComponent(profile.name[0])}`
          }
          alt={`${profile.name}'s avatar`}
          className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
        />
        <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="mt-2 italic text-gray-600">
            Skill Level: <span className="font-semibold">{profile.skill_level}</span>
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
          >
            Challenge {profile.name}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 text-center">
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold">Wins</h2>
          <p className="text-2xl">{wins}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold">Losses</h2>
          <p className="text-2xl">{losses}</p>
        </div>
      </div>

      {/* Recent Matches */}
      <h2 className="mt-8 text-2xl font-semibold">Recent Matches</h2>
      {matches.length ? (
        <ul className="mt-4 space-y-2">
          {matches.map((m) => (
            <li key={m.id} className="p-4 bg-gray-50 rounded-lg">
              {new Date(m.played_at).toLocaleDateString()} —{' '}
              Player1 ID: {m.player1_id}, Player2 ID: {m.player2_id} (
              {m.winner_id === profile.id ? 'Won' : 'Lost'})
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 italic text-gray-500">No match history yet.</p>
      )}

      <ChallengeModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        receiverId={profile.id}
        onChallengeSent={() => toast.success('Challenge sent!')}
      />
    </div>
  );
}

