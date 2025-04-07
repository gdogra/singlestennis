// backend/routes/challenges.js
import express from 'express';

const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.json({ message: 'Challenge routes working 🎾' });
});

export default router;

