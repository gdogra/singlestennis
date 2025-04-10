// backend/scripts/seed-matches.js
import dotenv from 'dotenv';
import { pool } from '../db/index.js';

dotenv.config();

const seedMatches = async () => {
  try {
    console.log('🌱 Seeding matches...');

    // Get users
    const { rows: users } = await pool.query('SELECT id, username FROM users');
    if (users.length < 2) {
      console.log('❌ Need at least two users to seed matches.');
      process.exit(1);
    }

    const player1 = users[0];
    const player2 = users[1];

    // Delete existing matches
    await pool.query('DELETE FROM matches');

    // Seed sample matches
    const now = new Date();
    const pastDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 1 week ago
    const futureDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

    await pool.query(
      `INSERT INTO matches (player_id, opponent_id, date, status, score) VALUES
        ($1, $2, $3, 'completed', '6-3, 6-4'),
        ($2, $1, $4, 'completed', '7-5, 4-6, 6-2'),
        ($1, $2, $5, 'scheduled', NULL)`,
      [player1.id, player2.id, pastDate, pastDate, futureDate]
    );

    console.log(`✅ Seeded matches between ${player1.username} and ${player2.username}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding matches:', err);
    process.exit(1);
  }
};

seedMatches();

