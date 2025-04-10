import express from 'express';
import { pool } from '../db/index.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/challenges/received
router.get('/received', verifyToken, async (req, res) => {
  const receiverId = req.user.userId;
  const result = await pool.query(
    `SELECT c.id, c.status, c.date, c.location, c.skill_level,
            u.id AS sender_id, u.first_name AS sender_first_name, u.last_name AS sender_last_name
     FROM challenges c
     JOIN users u ON c.sender_id = u.id
     WHERE c.receiver_id = $1 AND c.status = 'pending'
     ORDER BY c.date DESC;`,
    [receiverId]
  );
  res.json({ challenges: result.rows });
});

// GET /api/challenges/sent
router.get('/sent', verifyToken, async (req, res) => {
  const senderId = req.user.userId;
  const result = await pool.query(
    `SELECT c.id, c.status, c.date, c.location, c.skill_level,
            u.id AS receiver_id, u.first_name AS receiver_first_name, u.last_name AS receiver_last_name
     FROM challenges c
     JOIN users u ON c.receiver_id = u.id
     WHERE c.sender_id = $1
     ORDER BY c.date DESC;`,
    [senderId]
  );
  res.json({ challenges: result.rows });
});

// POST /api/challenges/:id/accept
router.post('/:id/accept', verifyToken, async (req, res) => {
  const challengeId = req.params.id;
  const receiverId = req.user.userId;

  const update = await pool.query(
    `UPDATE challenges SET status = 'accepted' WHERE id = $1 AND receiver_id = $2 RETURNING *;`,
    [challengeId, receiverId]
  );

  if (update.rows.length === 0) {
    return res.status(404).json({ message: 'Challenge not found or unauthorized' });
  }

  const challenge = update.rows[0];
  await pool.query(
    `INSERT INTO matches (player1_id, player2_id, date, location, score, winner_id)
     VALUES ($1, $2, $3, $4, NULL, NULL);`,
    [challenge.sender_id, challenge.receiver_id, challenge.date, challenge.location]
  );

  res.json({ message: 'Challenge accepted and match scheduled.' });
});

// POST /api/challenges/:id/decline
router.post('/:id/decline', verifyToken, async (req, res) => {
  const challengeId = req.params.id;
  const receiverId = req.user.userId;

  const update = await pool.query(
    `UPDATE challenges SET status = 'declined' WHERE id = $1 AND receiver_id = $2 RETURNING *;`,
    [challengeId, receiverId]
  );

  if (update.rows.length === 0) {
    return res.status(404).json({ message: 'Challenge not found or unauthorized' });
  }

  res.json({ message: 'Challenge declined.' });
});

export default router;

