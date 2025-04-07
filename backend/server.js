// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import playersRoutes from './routes/players.js';
import matchesRoutes from './routes/matches.js';
import challengesRoutes from './routes/challenges.js';
import dashboardRoutes from './routes/dashboard.js';
import profileRoutes from './routes/profile.js';
import adminRoutes from './routes/admin.js';

import { verifyToken } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Allow requests from localhost and Netlify
const allowedOrigins = [
  'http://localhost:3000',
  'https://singlestennis.netlify.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/auth', authRoutes);
app.use('/players', playersRoutes);
app.use('/matches', matchesRoutes);
app.use('/challenges', challengesRoutes);
app.use('/dashboard', verifyToken, dashboardRoutes);
app.use('/profile', profileRoutes);
app.use('/admin', verifyToken, adminRoutes);

// Fallback route
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

