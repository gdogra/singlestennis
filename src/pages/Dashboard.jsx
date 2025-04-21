// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../supabaseClient';
import StatsChart from '../components/StatsChart';
import CalendarView from '../components/CalendarView';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    async function loadStats() {
      try {
        const { data, error } = await supabase.rpc('get_user_match_stats');
        if (error) throw error;
        setStats(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load stats.');
      }
    }
    async function loadChallenges() {
      try {
        const { data, error } = await supabase
          .from('challenges')
          .select('*')
          .eq('receiver_id', supabase.auth.user().id);
        if (error) throw error;
        setChallenges(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load challenges.');
      }
    }
    loadStats();
    loadChallenges();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Match Stats</h2>
          {stats ? <StatsChart data={stats} /> : <p>Loading chart…</p>}
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Challenges</h2>
          {challenges.length ? (
            <CalendarView events={challenges} />
          ) : (
            <p>Loading calendar…</p>
          )}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-500">
          (Your recent matches and challenge responses will appear here.)
        </p>
      </div>
    </div>
  );
}

