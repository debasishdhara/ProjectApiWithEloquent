import dotenv from 'dotenv';
dotenv.config();

export type DBType = 'mongo' | 'mysql' | 'postgres' | 'sqlite';

export const dbConfig = {
  default: (process.env.ACTIVE_DB as DBType) || 'mysql',
  connections: {
    mongo: {
      uri: process.env.MONGO_URI || '',
    },
    mysql: {
      host: process.env.MYSQL_HOST || '',
      port: parseInt(process.env.MYSQL_PORT || '3306', 10),
      user: process.env.MYSQL_USER || '',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || '',
    },
    postgres: {
      host: process.env.PG_HOST || '',
      port: parseInt(process.env.PG_PORT || '5432', 10),
      user: process.env.PG_USER || '',
      password: process.env.PG_PASSWORD || '',
      database: process.env.PG_DATABASE || '',
    },
    sqlite: {
      filename: process.env.SQLITE_FILE || './system/database/database.sqlite',
    },
  },
};
