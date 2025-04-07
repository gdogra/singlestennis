import express from 'express';
import { pool } from '../db/index.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to verify token for all dashboard routes
router.use(verifyToken);

// Get dashboard summary for a user
router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const upcomingMatches = await pool.query(
      `SELECT COUNT(*) FROM matches WHERE (player1_id = $1 OR player2_id = $1) AND status = 'scheduled'`,
      [userId]
    );

    const completedMatches = await pool.query(
      `SELECT COUNT(*) FROM matches WHERE (player1_id = $1 OR player2_id = $1) AND status = 'completed'`,
      [userId]
    );

    const pendingChallenges = await pool.query(
      `SELECT COUNT(*) FROM challenges WHERE receiver_id = $1 AND status = 'pending'`,
      [userId]
    );

    res.json({
      upcoming: Number(upcomingMatches.rows[0].count),
      completed: Number(completedMatches.rows[0].count),
      pending: Number(pendingChallenges.rows[0].count),
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;

