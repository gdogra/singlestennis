// backend/routes/dashboard.js
import express from 'express';
import { pool } from '../db/index.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/dashboard/player-rankings
router.get('/player-rankings', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, first_name, last_name, wins, losses,
             (wins::float / NULLIF(wins + losses, 0)) AS win_ratio
      FROM users
      WHERE role = 'player'
      ORDER BY win_ratio DESC NULLS LAST
      LIMIT 20
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching player rankings:', err);
    res.status(500).json({ error: 'Failed to fetch player rankings' });
  }
});

export default router;

