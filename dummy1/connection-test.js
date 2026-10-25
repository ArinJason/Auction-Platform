const path = require('path');
const dns = require('dns');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dns.setServers(['1.1.1.1']);

const localEnvPath = path.join(__dirname, '.env');
const backendEnvPath = path.join(__dirname, '..', 'backend', '.env');
const envPath = require('fs').existsSync(localEnvPath) ? localEnvPath : backendEnvPath;

dotenv.config({ path: envPath });

const uri = process.env.MONGO_URI;

const run = async () => {
  if (!uri) {
    throw new Error(`MONGO_URI is not set in ${envPath}.`);
  }

  if (!uri.startsWith('mongodb+srv://')) {
    throw new Error('MONGO_URI must be an Atlas mongodb+srv:// connection string.');
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('Atlas connection successful.');
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(`Atlas connection failed: ${error.message}`);
  await mongoose.disconnect().catch(() => {});
  process.exitCode = 1;
});
