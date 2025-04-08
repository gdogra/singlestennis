// src/pages/Unauthorized.jsx
import React from 'react';

function Unauthorized() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold text-red-600">403 - Unauthorized</h1>
      <p className="mt-4">You don’t have access to this page.</p>
    </div>
  );
}

export default Unauthorized;

