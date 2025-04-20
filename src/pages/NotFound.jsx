import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600">Try /leaderboard or return to the home page.</p>
      </div>
    </div>
  );
}

