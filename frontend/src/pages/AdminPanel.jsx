// frontend/src/pages/AdminPanel.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import SeedMatchesButton from '../components/SeedMatchesButton';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPanel = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p className="text-gray-600">You must be an admin to access this panel.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      <p className="text-gray-700 mb-6">Welcome, {user.username || user.email}!</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Data Tools</h2>
        <div className="flex items-center gap-4">
          <SeedMatchesButton />
          {/* You can add more admin tools here */}
        </div>
      </section>

      {/* Future sections: Users, logs, analytics, match editor, etc. */}
      <section>
        <h2 className="text-xl font-semibold mb-2">More Coming Soon</h2>
        <p className="text-gray-500">User management, audit logs, challenge controls, etc.</p>
      </section>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default AdminPanel;

