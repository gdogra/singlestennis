// backend/server.js
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import matchesRoutes from './routes/matches.js';
import adminRoutes from './routes/admin.js';
import debugRoutes from './routes/debug.js';

// Load environment variables
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? './.env.production' : './.env',
});

const app = express();
const PORT = process.env.PORT || 8080;

// CORS Configuration
const allowedOrigins = [
  'https://singlestennis.netlify.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/debug', debugRoutes);

// Health check route
app.get('/api', (req, res) => {
  res.json({ message: 'API is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

