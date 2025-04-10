// frontend/src/components/AdminLogsTable.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminLogsTable = () => {
  const { token, user } = useAuth();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/admin/logs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to fetch logs');
        setLogs(json);
      } catch (err) {
        console.error(err);
        toast.error('Could not load admin logs');
      }
    };

    if (user?.role === 'admin') {
      fetchLogs();
    }
  }, [token, user]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-3">Admin Logs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">User ID</th>
              <th className="py-2 px-4 text-left">Action</th>
              <th className="py-2 px-4 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="py-1 px-4">{log.id}</td>
                <td className="py-1 px-4">{log.user_id}</td>
                <td className="py-1 px-4">{log.action}</td>
                <td className="py-1 px-4">{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLogsTable;

