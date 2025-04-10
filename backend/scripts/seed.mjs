// backend/scripts/seed.mjs
import pkg from 'pg';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true',
});

function generateMatchScore() {
  const getSetScore = () => {
    let a = Math.floor(Math.random() * 3) + 6;
    let b = Math.floor(Math.random() * 3);
    return `${a}-${b}`;
  };

  const sets = [getSetScore()];
  while (sets.length < 2 || Math.random() > 0.5 && sets.length < 3) {
    sets.push(getSetScore());
  }

  return sets.join(', ');
}

async function seed() {
  try {
    console.log('🧹 Clearing existing data');
    await pool.query('DELETE FROM matches');
    await pool.query('DELETE FROM challenges');
    await pool.query('DELETE FROM users');

    const hashedPassword = await bcrypt.hash('password123', 10);
    const userIds = [];

    console.log('👤 Inserting users...');
    for (let i = 0; i < 10; i++) {
      const first = faker.person.firstName();
      const last = faker.person.lastName();
      const email = faker.internet.email({ firstName: first, lastName: last });
      const avatar = faker.image.avatar();
      const skill = (Math.random() * 4 + 1).toFixed(1);

      const res = await pool.query(
        `INSERT INTO users (first_name, last_name, email, password_hash, avatar_url, skill_level)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [first, last, email, hashedPassword, avatar, skill]
      );

      userIds.push(res.rows[0].id);
    }

    console.log('🎾 Inserting matches...');
    for (let i = 0; i < 20; i++) {
      const [p1, p2] = faker.helpers.shuffle(userIds).slice(0, 2);
      const winner = faker.helpers.arrayElement([p1, p2]);
      const score = generateMatchScore();
      const date = faker.date.past({ years: 1 });

      await pool.query(
        `INSERT INTO matches (player1_id, player2_id, match_date, status, winner_id, score)
         VALUES ($1, $2, $3, 'completed', $4, $5)`,
        [p1, p2, date, winner, score]
      );
    }

    console.log('📬 Inserting challenges...');
    for (let i = 0; i < 10; i++) {
      const [sender, receiver] = faker.helpers.shuffle(userIds).slice(0, 2);
      const date = faker.date.future();
      const location = faker.location.city();
      const status = faker.helpers.arrayElement(['pending', 'accepted']);

      await pool.query(
        `INSERT INTO challenges (sender_id, receiver_id, match_date, location, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [sender, receiver, date, location, status]
      );
    }

    console.log('✅ Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seed();

