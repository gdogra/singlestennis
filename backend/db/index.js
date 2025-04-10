// backend/db/index.js
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  password: 'pos_brthe_O2', // force as string
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

export { pool };

