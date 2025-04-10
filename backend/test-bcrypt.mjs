// test-bcrypt.mjs
import bcrypt from 'bcrypt';

const plainPassword = 'password123';
const storedHash = '$2b$10$QdqNnPBMk0c5KDFQ.5ZnauG/l2Nh7zqHNs7BkTiWZzr9zV5ef9HF.'; // from your DB

const match = await bcrypt.compare(plainPassword, storedHash);
console.log(match ? '✅ Match' : '❌ No match');

