import { pool } from '../db/index.js';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const PASSWORD = 'password123';
const HASHED = await bcrypt.hash(PASSWORD, 10);

async function seed() {
  await pool.query('DELETE FROM matches');
  await pool.query('DELETE FROM challenges');
  await pool.query('DELETE FROM users');

  const userIds = [];
  for (let i = 0; i < 10; i++) {
    const first = faker.person.firstName();
    const last = faker.person.lastName();
    const email = faker.internet.email({ firstName: first, lastName: last }).toLowerCase();
    const skill = (Math.random() * 3 + 2).toFixed(1); // 2.0–5.0

    const { rows } = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, skill_level, wins, losses)
       VALUES ($1, $2, $3, $4, $5, 0, 0) RETURNING id`,
      [first, last, email, HASHED, skill]
    );
    userIds.push(rows[0].id);
  }

  for (let i = 0; i < userIds.length; i++) {
    for (let j = i + 1; j < userIds.length; j++) {
      const status = Math.random() > 0.5 ? 'completed' : 'scheduled';
      const winner = Math.random() > 0.5 ? userIds[i] : userIds[j];
      const loser = winner === userIds[i] ? userIds[j] : userIds[i];
      const score = `${6 + Math.floor(Math.random() * 2)}-${Math.floor(Math.random() * 5)}`;
      const date = faker.date.recent({ days: 30 });

      await pool.query(
        `INSERT INTO matches (player1_id, player2_id, status, winner_id, score, date)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userIds[i], userIds[j], status, status === 'completed' ? winner : null, status === 'completed' ? score : null, date]
      );
    }
  }

  for (let id of userIds) {
    const wins = Math.floor(Math.random() * 10);
    const losses = Math.floor(Math.random() * 10);
    await pool.query(`UPDATE users SET wins = $1, losses = $2 WHERE id = $3`, [wins, losses, id]);
  }

  console.log('✅ Seeded users and matches.');
  process.exit();
}

seed();

