// backend/routes/admin.js
import express from 'express';
import { pool } from '../db/index.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// GET /api/admin/users
router.get('/users', verifyToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, role, is_active FROM users ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['player', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
    res.json({ message: `User ${id} role updated to ${role}` });
  } catch (err) {
    console.error('Error updating role:', err);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// PUT /api/admin/users/:id/status
router.put('/users/:id/status', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  try {
    await pool.query('UPDATE users SET is_active = $1 WHERE id = $2', [is_active, id]);
    res.json({ message: `User ${id} status updated` });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// PUT /api/admin/matches/:id
router.put('/matches/:id', verifyToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, match_date, winner_id } = req.body;

  try {
    await pool.query(
      `UPDATE matches
       SET status = $1,
           match_date = $2,
           winner_id = $3
       WHERE id = $4`,
      [status, match_date, winner_id || null, id]
    );

    res.json({ message: `Match ${id} updated successfully` });
  } catch (err) {
    console.error('Error updating match:', err);
    res.status(500).json({ error: 'Failed to update match' });
  }
});

// GET /api/admin/stats/matches-per-day
router.get('/stats/matches-per-day', verifyToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(match_date::date, 'YYYY-MM-DD') AS date,
        COUNT(*) AS count
      FROM matches
      WHERE match_date >= CURRENT_DATE - INTERVAL '13 days'
      GROUP BY date
      ORDER BY date ASC
    `);

    res.json(result.rows.map(row => ({
      date: row.date,
      count: Number(row.count),
    })));
  } catch (err) {
    console.error('Error fetching match stats:', err);
    res.status(500).json({ error: 'Failed to fetch match stats' });
  }
});

// GET /api/admin/stats/challenges-per-status
router.get('/stats/challenges-per-status', verifyToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT status, COUNT(*) AS count
      FROM challenges
      GROUP BY status
    `);

    res.json(result.rows.map(row => ({
      status: row.status,
      count: Number(row.count),
    })));
  } catch (err) {
    console.error('Error fetching challenge stats:', err);
    res.status(500).json({ error: 'Failed to fetch challenge stats' });
  }
});

// GET /api/admin/logs
router.get('/logs', verifyToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, user_id, action, created_at
      FROM admin_logs
      ORDER BY created_at DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching admin logs:', err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

export default router;

