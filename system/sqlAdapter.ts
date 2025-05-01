// sqlAdapter.ts
import mysql from 'mysql2/promise';
import { dbConfig } from '@config/config';

export async function connectMySQL() {
  const connection = await mysql.createConnection(dbConfig.connections.mysql);
  console.log('MySQL connected');
  return connection;
}
