import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import challengesRoutes from './routes/challenges.js';
import playersRoutes from './routes/players.js';
import { verifyToken } from './middleware/authMiddleware.js';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Allow both local and Netlify frontends
const allowedOrigins = [
  'http://localhost:5173',
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

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.send('TennisConnect backend is live!'));

app.use('/auth', authRoutes);
app.use('/dashboard', verifyToken, dashboardRoutes);
app.use('/challenges', verifyToken, challengesRoutes);
app.use('/players', verifyToken, playersRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

