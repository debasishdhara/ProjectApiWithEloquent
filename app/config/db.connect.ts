import { dbConfig } from '@config/config';
import { connectMongo } from '@system/mongoAdapter';
import { connectSQL } from '@system/sqlAdapter';
async function connectDB() {
  const active = dbConfig.default;

  switch (active) {
    case 'mongo':
      return connectMongo();
      break;
    case 'mysql':
      return connectSQL('mysql');
      break;
    case 'postgres':
      return connectSQL('postgres');
      break;
    case 'sqlite':
      return connectSQL('sqlite');
      break;
    default:
      throw new Error('Unsupported DB type');
  }
}

// Exporting using CommonJS format
export const con = connectDB();
