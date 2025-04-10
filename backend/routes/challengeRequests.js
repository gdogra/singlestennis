import express from 'express';
import { pool } from '../db/index.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query(
      'SELECT * FROM challenges WHERE sender_id = $1 OR receiver_id = $1',
      [userId]
    );
    res.json(result.rows); // ✅ Plain array
  } catch (err) {
    console.error('Error fetching challenge requests:', err);
    res.status(500).json({ error: 'Failed to fetch challenge requests' });
  }
});

export default router;

