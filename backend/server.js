// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import playerRoutes from './routes/players.js';
import dashboardRoutes from './routes/dashboard.js';
import adminRoutes from './routes/admin.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://singlestennis.netlify.app'],
}));

// Routes
app.use('/auth', authRoutes);
app.use('/players', playerRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/admin', adminRoutes);

// Root Healthcheck endpoint for Railway
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'TennisConnect Backend Running 🚀' });
});

// Start server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

