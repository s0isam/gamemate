const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];

for (const key of requiredEnv) {
  if (!process.env[key] || !process.env[key].trim()) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

if (Buffer.byteLength(process.env.JWT_SECRET, 'utf8') < 32) {
  throw new Error('JWT_SECRET must be at least 32 bytes');
}

module.exports = {
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  clientUrl: process.env.CLIENT_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
};
