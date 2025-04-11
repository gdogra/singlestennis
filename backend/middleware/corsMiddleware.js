// backend/middleware/corsMiddleware.js
import cors from 'cors';

export const corsMiddleware = cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://singlestennis.netlify.app'
    : 'http://localhost:5173',
  credentials: true,
});

