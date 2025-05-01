import { dbConfig } from '@config/config';
import { connectMongo } from '@system/mongoAdapter';
import { connectMySQL } from '@system/sqlAdapter';
import { connectPostgres } from '@system/postgresAdapter';
import { connectSQLite } from '@system/sqliteAdapter';
async function connectDB() {
  const active = dbConfig.default;

  switch (active) {
    case 'mongo':
      return connectMongo();
      break;
    case 'mysql':
      return connectMySQL();
      break;
    case 'postgres':
      return connectPostgres();
      break;
    case 'sqlite':
      return connectSQLite();
      break;
    default:
      throw new Error('Unsupported DB type');
  }
}

// Exporting using CommonJS format
export const con = connectDB();
