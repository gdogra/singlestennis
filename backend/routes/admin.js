import express from 'express';
import { pool } from '../db/index.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.put('/users/:id/role', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
  res.json({ message: 'User role updated' });
});

router.put('/matches/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { score, winner_id } = req.body;

  await pool.query(
    'UPDATE matches SET score = $1, winner_id = $2 WHERE id = $3',
    [score, winner_id, id]
  );
  res.json({ message: 'Match updated' });
});

export default router;

