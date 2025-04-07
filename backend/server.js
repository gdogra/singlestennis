// backend/server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import playersRoutes from './routes/players.js';
import dashboardRoutes from './routes/dashboard.js';
import challengesRoutes from './routes/challenges.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Define allowed origins
const allowedOrigins = [
  'https://singlestennis.netlify.app',
  'http://localhost:3000',
  'http://localhost:65480'
];

// ✅ CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true
  })
);

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/auth', authRoutes);
app.use('/players', playersRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/challenges', challengesRoutes);
app.use('/admin', adminRoutes);

// Healthcheck
app.get('/', (req, res) => {
  res.send('🎾 TennisConnect backend is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

