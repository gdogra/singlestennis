import express from 'express';
import pool from '../db/index.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all players
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, skill_level, avatar_url FROM users ORDER BY skill_level DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// Get player by ID
router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT id, name, email, skill_level, avatar_url FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching player:', err);
    res.status(500).json({ error: 'Failed to fetch player' });
  }
});

export default router;

