// src/pages/AdminDashboard.jsx
import React from 'react';
import SeedMatchesButton from '../components/SeedMatchesButton';
import SeedChallengesButton from '../components/SeedChallengesButton';
import UserManagementTable from '../components/UserManagementTable';
import AdminStatsChart from '../components/AdminStatsChart';
import MatchEditor from '../components/MatchEditModal';
import AdminLogViewer from '../components/AdminLogViewer';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <p className="text-lg">Welcome, {user?.email}!</p>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Data Tools</h2>
        <div className="flex flex-wrap gap-4">
          <SeedMatchesButton />
          <SeedChallengesButton />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <UserManagementTable />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Match Editor</h2>
        <MatchEditor adminView />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Challenge Stats</h2>
        <AdminStatsChart />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Audit Logs</h2>
        <AdminLogViewer />
      </section>
    </div>
  );
};

export default AdminDashboard;

