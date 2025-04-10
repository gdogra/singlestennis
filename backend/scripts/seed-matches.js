// backend/scripts/seed-matches.js
import dotenv from 'dotenv';
import { pool } from '../db/index.js';

dotenv.config();

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateRandomScore = () => {
  const sets = Math.random() > 0.5 ? 2 : 3;
  const scores = Array.from({ length: sets }, () => {
    const p1 = Math.floor(Math.random() * 3) + 4;
    const p2 = Math.floor(Math.random() * 3) + 2;
    return `${p1}-${p2}`;
  });
  return scores.join(', ');
};

const generateRandomDate = (isFuture) => {
  const now = new Date();
  const offsetDays = Math.floor(Math.random() * 10) + 1;
  const date = new Date(now);
  date.setDate(now.getDate() + (isFuture ? offsetDays : -offsetDays));
  return date;
};

const seedMatches = async () => {
  try {
    console.log('🎾 Seeding random matches...');

    const { rows: users } = await pool.query('SELECT id, username FROM users');
    if (users.length < 2) {
      console.log('❌ Need at least 2 users to seed matches.');
      process.exit(1);
    }

    await pool.query('DELETE FROM matches');

    const matches = [];
    const matchCount = 10;

    for (let i = 0; i < matchCount; i++) {
      let player1 = getRandomItem(users);
      let player2 = getRandomItem(users);

      while (player1.id === player2.id) {
        player2 = getRandomItem(users); // avoid self match
      }

      const isCompleted = Math.random() < 0.7;
      const date = generateRandomDate(!isCompleted);
      const status = isCompleted ? 'completed' : 'scheduled';
      const score = isCompleted ? generateRandomScore() : null;
      const winner_id = isCompleted ? getRandomItem([player1.id, player2.id]) : null;
      const location = getRandomItem(['Court 1', 'Court 2', 'Downtown Club', 'TBD']);

      matches.push({
        player1_id: player1.id,
        player2_id: player2.id,
        match_date: date,
        location,
        score,
        status,
        sender_id: player1.id,
        receiver_id: player2.id,
        winner_id,
      });
    }

    for (const m of matches) {
      await pool.query(
        `INSERT INTO matches 
        (player1_id, player2_id, match_date, location, score, status, sender_id, receiver_id, winner_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          m.player1_id,
          m.player2_id,
          m.match_date,
          m.location,
          m.score,
          m.status,
          m.sender_id,
          m.receiver_id,
          m.winner_id,
        ]
      );
    }

    console.log(`✅ Seeded ${matchCount} random matches`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding matches:', err);
    process.exit(1);
  }
};

seedMatches();

