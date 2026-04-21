import mongoose from 'mongoose';
import { isMemoryMode } from './runtime.js';
import { seedMemoryStore } from '../utils/memoryStore.js';

export async function connectDB() {
  if (isMemoryMode) {
    await seedMemoryStore();
    console.log('Running backend in memory mode');
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is missing in backend/.env');
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

export async function disconnectDB() {
  if (!isMemoryMode) await mongoose.disconnect();
}
