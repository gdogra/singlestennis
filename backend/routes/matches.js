// backend/routes/matches.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Matches route works!' });
});

export default router;

