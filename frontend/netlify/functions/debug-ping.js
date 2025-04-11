// frontend/netlify/functions/debug-ping.js

export const handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Netlify function is alive ✅',
      timestamp: new Date().toISOString(),
    }),
  };
};

