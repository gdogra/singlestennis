// frontend/src/components/AdminStatsChart.jsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminStatsChart = () => {
  const { token, user } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats/matches-per-day', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load stats');
        setData(json);
      } catch (err) {
        console.error(err);
        toast.error('Could not load admin stats');
      }
    };

    if (user?.role === 'admin') {
      fetchStats();
    }
  }, [token, user]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Match Activity (last 14 days)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#1d4ed8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminStatsChart;

