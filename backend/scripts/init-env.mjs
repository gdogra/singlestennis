// backend/scripts/init-env.mjs
import bcrypt from 'bcrypt';
import { pool } from '../db/index.js';

const users = [
  {
    firstName: 'Helen',
    lastName: 'Keller',
    email: 'helen@example.com',
    password: 'password123',
  },
  {
    firstName: 'Serena',
    lastName: 'Williams',
    email: 'serena@example.com',
    password: 'tennisgoat',
  },
  {
    firstName: 'Rafael',
    lastName: 'Nadal',
    email: 'rafa@example.com',
    password: 'vamos123',
  },
];

async function seedUsers() {
  console.log('🌱 Seeding users...');
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await pool.query(
      `INSERT INTO users (first_name, last_name, email, password)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      [user.firstName, user.lastName, user.email, hashedPassword]
    );
    console.log(`✅ Inserted ${user.email}`);
  }
}

try {
  await seedUsers();
  console.log('✅ User seeding complete');
  process.exit(0);
} catch (err) {
  console.error('❌ Error seeding users:', err);
  process.exit(1);
}

