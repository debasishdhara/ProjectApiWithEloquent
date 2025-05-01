import { dbConfig } from '@config/config';
import { connectMongo } from '@system/mongoAdapter';
import { connectSQL } from '@system/sqlAdapter';
async function connectDB() {
  const active = dbConfig.default;

  switch (active) {
    case 'mongo': {
      const { mongoose, cachedMongoModels } = await connectMongo();
      return cachedMongoModels;
    }
    case 'mysql': {
      const { sequelize, cachedModels } = await connectSQL('mysql');
      return cachedModels;
    }
    case 'postgres': {
      const { sequelize, cachedModels } = await connectSQL('postgres');
      return cachedModels;
    }
    case 'sqlite': {
      const { sequelize, cachedModels } = await connectSQL('sqlite');
      return cachedModels;
    }
    default:
      throw new Error('Unsupported DB type');
  }
}

// Exporting using CommonJS format
export const con = connectDB();
