// frontend/scripts/validate-env.js
const requiredVars = ['VITE_GOOGLE_CLIENT_ID'];
let missing = false;

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing env variable: ${key}`);
    missing = true;
  }
});

if (missing) {
  process.exit(1);
} else {
  console.log('✅ Environment variables validated.');
}

