import jwt from 'jsonwebtoken';

const payload = {
  userId: '12345',
  username: 'helen', // Add any other data you'd like here
};

const secret = 'yourSecretKey';

// Create a token with no expiration
const token = jwt.sign(payload, secret);

console.log('Generated JWT:', token);

