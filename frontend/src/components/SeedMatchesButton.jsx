import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const SeedMatchesButton = () => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (user?.role !== 'admin') return null;

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/matches/seed', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Seeding failed');

      toast.success(data.message || 'Matches seeded!');
    } catch (err) {
      console.error('Seeding error:', err);
      toast.error('Failed to seed matches');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
    >
      {loading ? 'Seeding...' : 'Seed Random Matches'}
    </button>
  );
};

export default SeedMatchesButton;

