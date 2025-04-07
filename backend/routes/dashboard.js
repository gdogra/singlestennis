import express from 'express';
import pool from '../db/index.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Get dashboard data (example: rankings, match stats, etc.)
router.get('/player-rankings', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, skill_level, avatar_url FROM users ORDER BY skill_level DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching player rankings:', err);
    res.status(500).json({ error: 'Failed to fetch rankings' });
  }
});

// Additional dashboard routes can be added here (match history, upcoming matches, etc.)

export default router;

