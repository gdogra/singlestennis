// backend/routes/admin.js
import express from 'express';
import { pool } from '../db/index.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to restrict access to admins only
const requireAdmin = async (req, res, next) => {
  const userId = req.user?.id;
  try {
    const { rows } = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
    if (rows[0]?.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  } catch (err) {
    console.error('Admin check failed:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /admin/users - List all users
router.get('/users', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, email, role FROM users ORDER BY created_at DESC');
    res.json({ users: rows });
  } catch (err) {
    console.error('Failed to fetch users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// POST /admin/users/:id/role - Update user role
router.post('/users/:id/role', verifyToken, requireAdmin, async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, userId]);
    res.json({ message: `User role updated to ${role}` });
  } catch (err) {
    console.error('Failed to update role:', err);
    res.status(500).json({ message: 'Failed to update role' });
  }
});

export default router;

