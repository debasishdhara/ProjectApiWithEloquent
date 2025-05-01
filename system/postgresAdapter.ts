// postgresAdapter.ts
import { Client as PGClient } from 'pg';
import { dbConfig } from '@config/config';

export async function connectPostgres() {
  const targetDbName = dbConfig.connections.postgres.database;

  // Step 1: Connect to the default database ('postgres')
  const adminClient = new PGClient({
    ...dbConfig.connections.postgres,
    database: 'postgres', // important: connect to default DB first
  });

  await adminClient.connect();
  console.log('Connected to PostgreSQL (admin)');

  // Step 2: Check if target DB exists
  const res = await adminClient.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [targetDbName]
  );

  if (res.rowCount === 0) {
    console.log(`Database "${targetDbName}" not found. Creating...`);
    await adminClient.query(`CREATE DATABASE "${targetDbName}"`);
  } else {
    console.log(`Database "${targetDbName}" already exists.`);
  }

  await adminClient.end();

  // Step 3: Connect to the target database
  const client = new PGClient({
    ...dbConfig.connections.postgres,
    database: targetDbName,
  });

  await client.connect();
  console.log(`Connected to target PostgreSQL DB: ${targetDbName}`);
  return client;
}


// build query for get all data with soft delete and get all data without soft delete
 