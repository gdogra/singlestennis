import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import models from '../models/index.js';

const { User } = models;

const router = express.Router();

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Sign-in route
router.post('/google', async (req, res) => {
  try {
    const { token, email, name } = req.body;

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (payload.email !== email) {
      return res.status(400).json({ message: 'Email verification failed' });
    }

    // Check if user already exists
    let user = await User.getByEmail(email);

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), salt);

      user = await User.create({
        username: name,
        email,
        password: hashedPassword,
        role: 'player'
      });
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Google authentication successful',
      user: {
        id: user.id,
        username: user.name,
        email: user.email,
        role: user.role
      },
      token: jwtToken
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

