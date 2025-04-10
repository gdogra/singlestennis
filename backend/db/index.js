// backend/db/index.js
import pkg from 'pg';  // Use default import for CommonJS module
const { Pool } = pkg;  // Destructure Pool from the imported package

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

export { pool };

