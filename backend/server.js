require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifyToken, requireRole } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const statisticsRoutes = require('./routes/statistics');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Healthcheck route for Railway
app.get('/health', (req, res) => res.send('✅ Healthcheck passed'));

// Core routes
app.use('/auth', authRoutes);
app.use('/statistics', statisticsRoutes);

// DB connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// DB test
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('✅ Database connected at:', res.rows[0].now);
  }
});

// Auth
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
      [username, email, hashedPassword, 'player']
    );

    const token = jwt.sign(
      { id: newUser.rows[0].id, role: newUser.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ user: newUser.rows[0], token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (!userResult.rows.length || !(await bcrypt.compare(password, userResult.rows[0].password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role }, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Profile & Admin
app.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await pool.query('SELECT id, username, email, role FROM users WHERE id = $1', [req.user.id]);
    if (!user.rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(user.rows[0]);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/admin/users', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const users = await pool.query('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(users.rows);
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Matches
app.post('/matches', verifyToken, async (req, res) => {
  try {
    const { opponent_id, date, location } = req.body;
    const player_id = req.user.id;

    const match = await pool.query(
      'INSERT INTO matches (player1_id, player2_id, date, location, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [player_id, opponent_id, date, location, 'scheduled']
    );

    res.status(201).json(match.rows[0]);
  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/matches', verifyToken, async (req, res) => {
  try {
    const matches = await pool.query(
      `SELECT m.*, 
        u1.username AS player1_name, 
        u2.username AS player2_name 
       FROM matches m
       JOIN users u1 ON m.player1_id = u1.id
       JOIN users u2 ON m.player2_id = u2.id
       WHERE m.player1_id = $1 OR m.player2_id = $1
       ORDER BY m.date DESC`,
      [req.user.id]
    );
    res.json(matches.rows);
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/matches/:id/score', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { player1_score, player2_score } = req.body;

    const matchCheck = await pool.query(
      'SELECT * FROM matches WHERE id = $1 AND (player1_id = $2 OR player2_id = $2)',
      [id, req.user.id]
    );
    if (!matchCheck.rows.length) return res.status(403).json({ message: 'Not authorized' });

    const updatedMatch = await pool.query(
      'UPDATE matches SET player1_score = $1, player2_score = $2, status = $3 WHERE id = $4 RETURNING *',
      [player1_score, player2_score, 'completed', id]
    );

    res.json(updatedMatch.rows[0]);
  } catch (error) {
    console.error('Update match score error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});

