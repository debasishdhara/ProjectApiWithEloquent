import dotenv from 'dotenv';
// Initialize dotenv
dotenv.config();

// Define database type
export type DBType = 'mongo' | 'mysql' | 'postgres' | 'sqlite';

// Active DB Type, defaulted from environment variable
export const activeDbType: DBType = (process.env.ACTIVE_DB as DBType) || 'mysql';

// Define a type for the create/update data
export interface CreateOrUpdateData {
  [key: string]: any;
}
