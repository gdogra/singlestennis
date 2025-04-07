// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import authRoutes from './routes/auth.js';
import playerRoutes from './routes/players.js';
import dashboardRoutes from './routes/dashboard.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Updated CORS to allow Netlify + localhost
const allowedOrigins = [
  'http://localhost:3000',
  'https://singlestennis.netlify.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);

app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/players', playerRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/admin', adminRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Server is live!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

