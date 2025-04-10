import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const UserManagementTable = () => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user || user.role !== 'admin') return null;

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, newRole) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error('Failed to update role');
      toast.success('Role updated');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const toggleStatus = async (id, isActive) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !isActive }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success('Status updated');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Manage Users</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-sm text-gray-600">
              <th className="py-2">Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="py-2">{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.is_active ? 'Active' : 'Inactive'}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => updateRole(u.id, u.role === 'admin' ? 'player' : 'admin')}
                    className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Set {u.role === 'admin' ? 'Player' : 'Admin'}
                  </button>
                  <button
                    onClick={() => toggleStatus(u.id, u.is_active)}
                    className={`${
                      u.is_active ? 'bg-red-600' : 'bg-green-600'
                    } text-white px-2 py-1 rounded text-sm`}
                  >
                    {u.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagementTable;

