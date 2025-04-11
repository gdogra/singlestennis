// backend/routes/debug.js
import express from 'express';
import { pool } from '../db/index.js';

const router = express.Router();

router.get('/ping', (req, res) => {
  res.json({ message: 'Server is alive' });
});

router.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (error) {
    console.error('[DB TEST ERROR]', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

export default router;

