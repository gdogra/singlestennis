// src/components/ReceivedChallenges.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ReceivedChallenges = () => {
  const { token } = useAuth();
  const [challenges, setChallenges] = useState([]);

  const fetchChallenges = async () => {
    const res = await fetch('/api/challenges/received', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setChallenges(data.challenges);
  };

  const handleAccept = async (id) => {
    await fetch(`/api/challenges/${id}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchChallenges();
  };

  const handleDecline = async (id) => {
    await fetch(`/api/challenges/${id}/decline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchChallenges();
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Received Challenges</h2>
      {challenges.length === 0 ? (
        <p>No pending challenges.</p>
      ) : (
        challenges.map((c) => (
          <div key={c.id} className="border p-4 mb-4 rounded shadow">
            <p><strong>{c.sender_first_name} {c.sender_last_name}</strong> challenged you</p>
            <p><strong>Date:</strong> {new Date(c.date).toLocaleString()}</p>
            <p><strong>Location:</strong> {c.location}</p>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => handleAccept(c.id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Accept
              </button>
              <button
                onClick={() => handleDecline(c.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Decline
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReceivedChallenges;

