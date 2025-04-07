import express from 'express';
import { pool } from '../db/index.js';

const router = express.Router();

// GET /dashboard - test or real dashboard data
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Dashboard is working', time: result.rows[0].now });
  } catch (error) {
    console.error('Error in /dashboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

