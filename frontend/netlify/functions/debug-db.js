// frontend/netlify/functions/debug-db.js
import { Client } from 'pg';

export default async (req, res) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const result = await client.query('SELECT NOW()');
    await client.end();

    return res.status(200).json({
      status: 'ok',
      time: result.rows[0].now,
    });
  } catch (err) {
    console.error('[Netlify Debug] DB connection error:', err);
    return res.status(500).json({
      error: 'Database connection failed',
      detail: err.message,
    });
  }
};

