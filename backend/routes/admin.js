import express from 'express';
import pool from '../db/index.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Get list of users (admin-only)
router.get('/users', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role FROM users ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role
router.post('/users/:id/role', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
    res.json({ success: true, message: 'User role updated' });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

export default router;

