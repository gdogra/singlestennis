// backend/routes/profile.js
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET /profile/:id - fetch user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error in /profile/:id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

