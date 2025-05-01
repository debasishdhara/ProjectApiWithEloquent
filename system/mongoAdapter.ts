// mongoAdapter.ts
import mongoose from 'mongoose';
import { dbConfig } from '@config/config';

export async function connectMongo() {
  await mongoose.connect(dbConfig.connections.mongo.uri);
  console.log('MongoDB connected');
  return mongoose;
}
