// backend/routes/matches.js
import express from 'express';
import { pool } from '../db/index.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const generateRandomScore = () => {
  const sets = Math.random() > 0.5 ? 2 : 3;
  return Array.from({ length: sets }, () =>
    `${Math.floor(Math.random() * 3) + 4}-${Math.floor(Math.random() * 3) + 2}`
  ).join(', ');
};
const generateDate = (past = false) => {
  const d = new Date();
  d.setDate(d.getDate() + (past ? -1 : 1) * Math.floor(Math.random() * 10));
  return d;
};

// 🔐 GET /api/matches/recent
router.get('/recent', verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const result = await pool.query(
      `SELECT 
        m.id,
        m.match_date AS date,
        m.score,
        u.username AS opponent_name
      FROM matches m
      JOIN users u 
        ON u.id = CASE 
                    WHEN m.player1_id = $1 THEN m.player2_id 
                    ELSE m.player1_id 
                 END
      WHERE (m.player1_id = $1 OR m.player2_id = $1)
        AND m.status = 'completed'
      ORDER BY m.match_date DESC
      LIMIT 5`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recent matches:', err);
    res.status(500).json({ error: 'Failed to fetch recent matches' });
  }
});

// 🔐 GET /api/matches/scheduled
router.get('/scheduled', verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const result = await pool.query(
      `SELECT 
        m.id,
        m.match_date AS date,
        m.location,
        u.username AS opponent_name
      FROM matches m
      JOIN users u 
        ON u.id = CASE 
                    WHEN m.player1_id = $1 THEN m.player2_id 
                    ELSE m.player1_id 
                 END
      WHERE (m.player1_id = $1 OR m.player2_id = $1)
        AND m.status = 'scheduled'
      ORDER BY m.match_date ASC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching scheduled matches:', err);
    res.status(500).json({ error: 'Failed to fetch scheduled matches' });
  }
});

// 🔐 POST /api/matches/seed (admin only)
router.post('/seed', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { rows: users } = await pool.query('SELECT id FROM users');
    if (users.length < 2) return res.status(400).json({ error: 'Not enough users' });

    await pool.query('DELETE FROM matches');

    const count = 10;
    for (let i = 0; i < count; i++) {
      let p1 = getRandomItem(users);
      let p2 = getRandomItem(users);
      while (p1.id === p2.id) p2 = getRandomItem(users);

      const completed = Math.random() > 0.3;
      const status = completed ? 'completed' : 'scheduled';
      const date = generateDate(!completed);
      const score = completed ? generateRandomScore() : null;
      const winner = completed ? getRandomItem([p1.id, p2.id]) : null;
      const location = getRandomItem(['Court 1', 'Downtown Club', 'Park', 'TBD']);

      await pool.query(
        `INSERT INTO matches 
         (player1_id, player2_id, match_date, location, status, score, sender_id, receiver_id, winner_id)
         VALUES ($1,$2,$3,$4,$5,$6,$1,$2,$7)`,
        [p1.id, p2.id, date, location, status, score, winner]
      );
    }

    res.json({ message: `✅ Seeded ${count} matches` });
  } catch (err) {
    console.error('Match seeding failed:', err);
    res.status(500).json({ error: 'Match seeding failed' });
  }
});

export default router;

