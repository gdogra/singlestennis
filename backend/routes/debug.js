// backend/routes/debug.js
import express from 'express';
import { pool } from '../db/index.js';

const router = express.Router();

router.get('/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', time: result.rows[0].now });
  } catch (error) {
    console.error('[DEBUG] DB connection error:', error);
    res.status(500).json({ error: 'Database connection failed', detail: error.message });
  }
});

export default router;

