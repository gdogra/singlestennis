import bcrypt from 'bcrypt';
import { pool } from './db/index.js';

const seed = async () => {
  const email = 'helen@example.com';
  const password = 'password123';
  const firstName = 'Helen';
  const lastName = 'Demo';

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query('DELETE FROM users WHERE email = $1', [email]);

    await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name) 
       VALUES ($1, $2, $3, $4)`,
      [email, hashedPassword, firstName, lastName]
    );

    console.log('✅ Seeded test user: helen@example.com / password123');
  } catch (err) {
    console.error('❌ Error seeding user:', err);
  } finally {
    process.exit();
  }
};

seed();

