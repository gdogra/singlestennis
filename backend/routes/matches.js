// backend/routes/matches.js
import express from 'express';
import { pool } from '../db/index.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/matches/recent
router.get('/recent', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.id, m.scheduled_at, m.location, m.score, 
              p1.first_name AS player1, p2.first_name AS player2
       FROM matches m
       JOIN users p1 ON m.player1_id = p1.id
       JOIN users p2 ON m.player2_id = p2.id
       ORDER BY m.scheduled_at DESC
       LIMIT 5`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recent matches:', err);
    res.status(500).json({ error: 'Failed to fetch recent matches' });
  }
});

// GET /api/matches/scheduled
router.get('/scheduled', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT m.id, m.scheduled_at, m.location, m.status,
              p1.first_name AS player1, p2.first_name AS player2
       FROM matches m
       JOIN users p1 ON m.player1_id = p1.id
       JOIN users p2 ON m.player2_id = p2.id
       WHERE m.status = 'scheduled' AND (m.player1_id = $1 OR m.player2_id = $1)
       ORDER BY m.scheduled_at ASC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching scheduled matches:', err);
    res.status(500).json({ error: 'Failed to fetch scheduled matches' });
  }
});

export default router;

