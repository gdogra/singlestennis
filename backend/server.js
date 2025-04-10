// backend/server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import matchesRoutes from './routes/matches.js';
import dashboardRoutes from './routes/dashboard.js';
import challengeRoutes from './routes/challengeRequests.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Route Mounting
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/challenges', challengeRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

