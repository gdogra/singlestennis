// src/pages/Challenges.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../supabaseClient';
import ChallengeModal from '../components/ChallengeModal';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function loadChallenges() {
      try {
        const user = supabase.auth.user();
        const { data: recData, error: recError } = await supabase
          .from('challenges')
          .select('*')
          .eq('receiver_id', user.id);
        const { data: sentData, error: sentError } = await supabase
          .from('challenges')
          .select('*')
          .eq('sender_id', user.id);
        if (recError || sentError) throw recError || sentError;
        setChallenges([
          ...recData.map(c => ({ ...c, type: 'Received' })),
          ...sentData.map(c => ({ ...c, type: 'Sent' })),
        ]);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load challenges.');
      } finally {
        setLoading(false);
      }
    }
    loadChallenges();
  }, []);

  if (loading) return <div className="p-6">Loading challenges…</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">Challenges</h1>
      {challenges.length ? (
        <ul className="space-y-2">
          {challenges.map(ch => (
            <li key={ch.id} className="p-4 bg-white shadow rounded-lg">
              <p className="font-semibold">{ch.type} Challenge</p>
              <p>Message: {ch.message}</p>
              {ch.scheduled_for && <p>Scheduled for: {new Date(ch.scheduled_for).toLocaleDateString()}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="italic text-gray-500">No challenges yet.</p>
      )}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setModalOpen(true)}
      >
        Send Challenge
      </button>
      <ChallengeModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        receiverId={null}
        onChallengeSent={() => window.location.reload()}
      />
    </div>
  );
}
