// backend/scripts/seed-challenges.js
import dotenv from 'dotenv';
import { pool } from '../db/index.js';

dotenv.config();

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const statuses = ['pending', 'accepted', 'declined'];
const locations = ['Court A', 'Court B', 'Downtown Club', 'East Park', 'TBD'];

const generateRandomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 7));
  return date;
};

const seedChallenges = async () => {
  try {
    console.log('🎯 Seeding challenge requests...');

    const { rows: users } = await pool.query('SELECT id, username FROM users');
    if (users.length < 2) {
      console.log('❌ Need at least 2 users to seed challenges.');
      process.exit(1);
    }

    await pool.query('DELETE FROM challenges');

    const challengeCount = 12;
    const challenges = [];

    for (let i = 0; i < challengeCount; i++) {
      let sender = getRandomItem(users);
      let receiver = getRandomItem(users);
      while (sender.id === receiver.id) {
        receiver = getRandomItem(users);
      }

      challenges.push({
        sender_id: sender.id,
        receiver_id: receiver.id,
        match_date: generateRandomDate(),
        status: getRandomItem(statuses),
        location: getRandomItem(locations),
      });
    }

    for (const c of challenges) {
      await pool.query(
        `INSERT INTO challenges 
         (sender_id, receiver_id, match_date, status, location)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          c.sender_id,
          c.receiver_id,
          c.match_date,
          c.status,
          c.location,
        ]
      );
    }

    console.log(`✅ Seeded ${challengeCount} challenges`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding challenges:', err);
    process.exit(1);
  }
};

seedChallenges();

