import { connectDB } from './src/config/database.js';

console.log('Testing MongoDB connection...');

try {
  await connectDB();
  console.log('✅ MongoDB connection test successful!');
  process.exit(0);
} catch (error) {
  console.error('❌ MongoDB connection test failed:', error.message);
  process.exit(1);
}
