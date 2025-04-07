// backend/server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import playersRoutes from './routes/players.js';
import matchesRoutes from './routes/matches.js';
import profileRoutes from './routes/profile.js';
import adminRoutes from './routes/admin.js';
import { verifyToken } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/dashboard', verifyToken, dashboardRoutes);
app.use('/players', verifyToken, playersRoutes);
app.use('/matches', verifyToken, matchesRoutes);
app.use('/profile', verifyToken, profileRoutes);
app.use('/admin', verifyToken, adminRoutes);

app.get('/', (req, res) => {
  res.send('🎾 SinglesTennis API is live');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

