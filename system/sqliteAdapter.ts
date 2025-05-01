// sqliteAdapter.ts
import sqlite3 from 'sqlite3';
import { dbConfig } from '@config/config';

export function connectSQLite(): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbConfig.connections.sqlite.filename, (err) => {
      if (err) {
        console.error('SQLite error:', err);
        reject(err);
      } else {
        console.log('SQLite connected');
        resolve(db);
      }
    });
  });
}
