// frontend/src/components/SeedChallengesButton.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const SeedChallengesButton = () => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'admin') return null;

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/challenges/seed', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Seeding failed');
      toast.success(data.message || 'Challenges seeded!');
    } catch (err) {
      console.error('Challenge seeding failed:', err);
      toast.error('Failed to seed challenges');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
    >
      {loading ? 'Seeding...' : 'Seed Challenges'}
    </button>
  );
};

export default SeedChallengesButton;

