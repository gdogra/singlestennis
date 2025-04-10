import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

const ChallengeStatsChart = () => {
  const { token, user } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats/challenges-per-status', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load stats');
        setData(json);
      } catch (err) {
        console.error(err);
        toast.error('Could not load challenge stats');
      }
    };

    if (user?.role === 'admin') {
      fetchStats();
    }
  }, [token, user]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Challenge Status Breakdown</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChallengeStatsChart;

