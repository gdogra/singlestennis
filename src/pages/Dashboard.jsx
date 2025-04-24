import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return navigate('/login');

    const fetchMatches = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
        .order('played_at', { ascending: false });

      if (error) {
        toast.error('Failed to load matches');
        console.error('Error loading matches:', error);
      } else {
        setMatches(data);
      }
      setLoading(false);
    };

    fetchMatches();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard</h1>
      {loading ? (
        <p className="text-gray-600">Loading match history...</p>
      ) : matches.length === 0 ? (
        <p className="text-gray-500">No matches found.</p>
      ) : (
        <ul className="space-y-4">
          {matches.map((match) => (
            <li key={match.id} className="border p-4 rounded shadow-sm">
              <div className="font-medium">Played at: {new Date(match.played_at).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Player 1: {match.player1_id}</div>
              <div className="text-sm text-gray-600">Player 2: {match.player2_id}</div>
              <div className="text-sm font-semibold">Winner: {match.winner_id}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

