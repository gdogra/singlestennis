// backend/server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { verifyToken } from './middleware/authMiddleware.js';
import authRoutes from './routes/auth.js';
import matchesRoutes from './routes/matches.js';
import challengeRequestsRoutes from './routes/challengeRequests.js';
import dashboardRoutes from './routes/dashboard.js';
import playersRoutes from './routes/players.js';
import adminRoutes from './routes/admin.js';
import debugRoutes from './routes/debug.js'; // ✅ NEW: Debug diagnostic route

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? './.env.production' : './.env',
});

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', verifyToken, matchesRoutes);
app.use('/api/challenges', verifyToken, challengeRequestsRoutes);
app.use('/api/dashboard', verifyToken, dashboardRoutes);
app.use('/api/players', verifyToken, playersRoutes);
app.use('/api/admin', verifyToken, adminRoutes);
app.use('/api/debug', debugRoutes); // ✅ Add debug route for DB connectivity

// Root route (optional)
app.get('/api', (req, res) => {
  res.send({ message: '🎾 TennisConnect API is live!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

