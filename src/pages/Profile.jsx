import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChallengeModal from '../components/ChallengeModal';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch(`/api/profiles/${id || ''}`);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        toast.error('Failed to load profile.');
      }
    }
    async function loadMatches() {
      try {
        const res = await fetch(`/api/matches?player=${id || 'me'}`);
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        toast.error('Failed to load matches.');
      }
    }
    loadProfile();
    loadMatches();
  }, [id]);

  if (!profile) return <div className="p-6">Loading profile…</div>;

  const wins = matches.filter(m => m.winner_id === profile.id).length;
  const losses = matches.length - wins;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-6">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <img
          src={profile.avatar_url || `https://via.placeholder.com/150?text=${profile.name[0]}`}
          alt={`${profile.name}'s avatar`}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
        />
        <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          {profile.location && <p className="mt-1 text-gray-600">{profile.location}</p>}
          {profile.bio ? (
            <p className="mt-2">{profile.bio}</p>
          ) : (
            <p className="mt-2 italic text-gray-500">No bio available.</p>
          )}
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
          {matches.slice(0, 5).map(m => (
            <li key={m.id} className="p-4 bg-gray-50 rounded-lg shadow">
              <span>{new Date(m.played_at).toLocaleDateString()}</span> —{' '}
              {m.player1_name} vs {m.player2_name} (
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

