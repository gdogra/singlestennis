// frontend/netlify/functions/debug-db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

exports.handler = async function () {
  try {
    const result = await pool.query('SELECT NOW()');
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Connected to database',
        time: result.rows[0].now,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Database connection failed', details: err.message }),
    };
  }
};

