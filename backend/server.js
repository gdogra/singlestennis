import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import playerRoutes from './routes/players.js';
import dashboardRoutes from './routes/dashboard.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

// ✅ Allow frontend (Netlify) + local dev origins
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
        callback(new Error(`❌ CORS blocked: ${origin}`));
      }
    },
    credentials: true
  })
);

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/players', playerRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/admin', adminRoutes);

// ✅ Final fallback or health check
app.get('/', (req, res) => {
  res.send('TennisConnect backend is running 🎾');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

