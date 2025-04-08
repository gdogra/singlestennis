import React from 'react';

function AdminPanel() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Admin Panel</h1>
      <p className="text-gray-600">Welcome, admin! You have elevated privileges.</p>

      {/* Example sections */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">User Management</h2>
        <p className="text-gray-500">[Coming soon] View, promote, or deactivate users.</p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">Match Oversight</h2>
        <p className="text-gray-500">[Coming soon] Review flagged matches, resolve disputes.</p>
      </div>
    </div>
  );
}

export default AdminPanel;

