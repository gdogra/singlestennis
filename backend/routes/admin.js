// backend/routes/admin.js
import express from 'express';
import { pool } from '../db/index.js';

const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user role
router.post('/users/:id/role', async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  try {
    await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, userId]);
    res.json({ message: 'User role updated successfully' });
  } catch (err) {
    console.error('Error updating role:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

