// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import playersRoutes from './routes/players.js';
import dashboardRoutes from './routes/dashboard.js';
import challengesRoutes from './routes/challenges.js';
import matchesRoutes from './routes/matches.js';
import adminRoutes from './routes/admin.js';
import { verifyToken } from './middleware/authMiddleware.js';
import pool from './db.js';

// Load environment variables
const envPath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 8080;

// Parse JSON
app.use(express.json());
app.use(morgan('dev'));

// CORS setup
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Health check
app.get('/', (req, res) => {
  res.send('TennisConnect API is running');
});

// Public routes
app.use('/auth', authRoutes);

// Protected routes
app.use('/players', verifyToken, playersRoutes);
app.use('/dashboard', verifyToken, dashboardRoutes);
app.use('/challenges', verifyToken, challengesRoutes);
app.use('/matches', verifyToken, matchesRoutes);
app.use('/admin', verifyToken, adminRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

