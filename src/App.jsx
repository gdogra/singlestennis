import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PlayerRankings from './pages/PlayerRankings';
import NotFound from './pages/NotFound';

const Home = () => (
  <div className="p-6 text-center">
    <h1 className="text-3xl font-bold mb-4">Welcome to SingleTennis</h1>
    <p className="text-gray-600">Use the navigation to explore the app.</p>
  </div>
);

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<PlayerRankings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;

