// backend/models/User.js
import { pool } from '../db/index.js'; // ✅ correct

const User = {
  async getByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  async create({ username, email, password, role }) {
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, password, role]
    );
    return result.rows[0];
  }
};

export default User;

