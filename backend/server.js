import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import challengesRoutes from './routes/challenges.js';
import playersRoutes from './routes/players.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://singlestennis.netlify.app'],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

// Route mounting
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/challenges', challengesRoutes);
app.use('/players', playersRoutes);

// Health check
app.get('/', (req, res) => res.send('🎾 TennisConnect API is live'));

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

