// backend/server.js

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import playerRoutes from './routes/players.js';
import challengeRoutes from './routes/challenges.js';
import matchRoutes from './routes/matches.js';
import adminRoutes from './routes/admin.js';
import profileRoutes from './routes/profile.js';
import { verifyToken } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// --- CORS ---
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://singlestennis.netlify.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// --- Middleware ---
app.use(morgan('dev'));
app.use(express.json());

// --- Routes ---
app.use('/auth', authRoutes);
app.use('/dashboard', verifyToken, dashboardRoutes);
app.use('/players', verifyToken, playerRoutes);
app.use('/challenges', verifyToken, challengeRoutes);
app.use('/matches', verifyToken, matchRoutes);
app.use('/admin', verifyToken, adminRoutes);
app.use('/profile', verifyToken, profileRoutes);

// --- Health check ---
app.get('/', (req, res) => {
  res.send('🎾 TennisConnect backend is running!');
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

