// backend/routes/index.js
import express from 'express';
const router = express.Router();

// Example route
router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

export default router;

