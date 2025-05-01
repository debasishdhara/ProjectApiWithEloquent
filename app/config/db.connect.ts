import { dbConfig } from '@config/config';
import { connectMongo } from '@system/mongoAdapter';
import { connectSQL } from '@system/sqlAdapter';
async function connectDB() {
  const active = dbConfig.default;

  switch (active) {
    case 'mongo': {
      const { mongoose, models } = await connectMongo();
      return models;
    }
    case 'mysql': {
      const { sequelize, models } = await connectSQL('mysql');
      return models;
    }
    case 'postgres': {
      const { sequelize, models } = await connectSQL('postgres');
      return models;
    }
    case 'sqlite': {
      const { sequelize, models } = await connectSQL('sqlite');
      return models;
    }
    default:
      throw new Error('Unsupported DB type');
  }
}

// Exporting using CommonJS format
export const con = connectDB();
