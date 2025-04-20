import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Profile', path: '/profile' },
    { name: 'Challenges', path: '/challenges' },
    { name: 'Calendar', path: '/calendar' }
  ];

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-lg font-bold">
          SingleTennis
        </Link>
        <ul className="flex gap-4">
          {navItems.map(({ name, path }) => (
            <li key={path}>
              <Link
                to={path}
                className={`hover:underline ${
                  location.pathname === path ? 'underline font-semibold' : ''
                }`}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

