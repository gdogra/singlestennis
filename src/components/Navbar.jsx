// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow p-4 flex justify-between items-center z-10">
      <Link to="/" className="text-xl font-bold">SingleTennis</Link>
      <ul className="flex space-x-4">
        <li><Link to="/leaderboard">Leaderboard</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/challenges">Challenges</Link></li>
        <li><Link to="/calendar">Calendar</Link></li>
      </ul>
    </nav>
  );
}

