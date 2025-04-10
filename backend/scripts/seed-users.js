// backend/scripts/seed-users.js
import { pool } from '../db/index.js';
import bcrypt from 'bcrypt';

const users = [
  {
    first_name: 'Admin',
    last_name: 'User',
    username: 'admin',
    email: 'admin@example.com',
    password: 'adminpass',
    role: 'admin',
  },
  {
    first_name: 'Helen',
    last_name: 'Smith',
    username: 'helen',
    email: 'helen@example.com',
    password: 'helen123',
    role: 'player',
  },
  {
    first_name: 'Roger',
    last_name: 'Federer',
    username: 'roger',
    email: 'roger@example.com',
    password: 'roger123',
    role: 'player',
  },
  {
    first_name: 'Serena',
    last_name: 'Williams',
    username: 'serena',
    email: 'serena@example.com',
    password: 'serena123',
    role: 'player',
  },
  {
    first_name: 'Rafa',
    last_name: 'Nadal',
    username: 'rafa',
    email: 'rafa@example.com',
    password: 'rafa123',
    role: 'player',
  },
  {
    first_name: 'Novak',
    last_name: 'Djokovic',
    username: 'novak',
    email: 'novak@example.com',
    password: 'novak123',
    role: 'player',
  },
];

const seedUsers = async () => {
  console.log('🌱 Seeding users...');
  try {
    await pool.query('DELETE FROM matches');
    await pool.query('DELETE FROM challenges');
    await pool.query('DELETE FROM users');

    for (const user of users) {
      const hashed = await bcrypt.hash(user.password, 10);
      await pool.query(
        `INSERT INTO users (
          first_name, last_name, username, email, password, role, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, true)`,
        [
          user.first_name,
          user.last_name,
          user.username,
          user.email,
          hashed,
          user.role,
        ]
      );
    }

    console.log(`✅ Seeded ${users.length} users`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding users:', err);
    process.exit(1);
  }
};

seedUsers();

