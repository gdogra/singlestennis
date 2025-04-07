// backend/server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import playersRoutes from './routes/players.js';
import dashboardRoutes from './routes/dashboard.js';
import challengesRoutes from './routes/challenges.js';
import matchesRoutes from './routes/matches.js';
import profileRoutes from './routes/profile.js';
import adminRoutes from './routes/admin.js';
import { verifyToken } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://singlestennis.netlify.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Routes
app.use('/auth', authRoutes);
app.use('/players', playersRoutes);
app.use('/dashboard', verifyToken, dashboardRoutes);
app.use('/challenges', challengesRoutes);
app.use('/matches', matchesRoutes);
app.use('/profile', profileRoutes);
app.use('/admin', adminRoutes);

// Fallback route
app.get('/', (req, res) => {
  res.send('TennisConnect API is running.');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

