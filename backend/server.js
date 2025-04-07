// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import playerRoutes from './routes/players.js';
import dashboardRoutes from './routes/dashboard.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Allow CORS from localhost and Netlify
const allowedOrigins = [
  'http://localhost:3000',
  'https://singlestennis.netlify.app'
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/players', playerRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/admin', adminRoutes);

// Healthcheck
app.get('/', (req, res) => {
  res.send('✅ Backend is running.');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

