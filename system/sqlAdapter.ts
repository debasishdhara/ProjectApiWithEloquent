// system/sqlAdapter.ts
import { dbConfig } from '@config/config';
import { Sequelize, DataTypes, DataType } from 'sequelize';
import { loadModels } from './modelLoader';

// Manual map of supported types
const typeMap: Record<string, DataType> = {
  STRING: DataTypes.STRING,
  TEXT: DataTypes.TEXT,
  INTEGER: DataTypes.INTEGER,
  BIGINT: DataTypes.BIGINT,
  FLOAT: DataTypes.FLOAT,
  DOUBLE: DataTypes.DOUBLE,
  DECIMAL: DataTypes.DECIMAL,
  BOOLEAN: DataTypes.BOOLEAN,
  DATE: DataTypes.DATE,
  DATEONLY: DataTypes.DATEONLY,
  TIME: DataTypes.TIME,
  UUID: DataTypes.UUID,
  UUIDV4: DataTypes.UUIDV4,
  JSON: DataTypes.JSON,
  JSONB: DataTypes.JSONB,
  ENUM: DataTypes.ENUM, // use only with extra args
  BLOB: DataTypes.BLOB,
};

interface FieldDefinition {
  type: string;
  allowNull?: boolean;
  unique?: boolean;
}

interface ModelSchema {
  [key: string]: FieldDefinition;
}

export async function connectSQL(databaseType: 'mysql' | 'postgres' | 'sqlite') {
  const dbConfigConnection: any = dbConfig.connections[databaseType];
  let sequelize: Sequelize;

  if (databaseType === 'sqlite') {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: dbConfigConnection.filename,
    });
  } else {
    sequelize = new Sequelize({
      dialect: databaseType,
      host: dbConfigConnection.host,
      port: dbConfigConnection.port,
      username: dbConfigConnection.user,
      password: dbConfigConnection.password,
      database: dbConfigConnection.database,
      logging: false,
    });
  }

  try {
    await sequelize.authenticate();
    console.log(`${databaseType} connected`);
  } catch (err) {
    console.error(`${databaseType} connection error:`, err);
    throw err;
  }

  // Load and register models dynamically
  const modelDefinitions = await loadModels();

  const models: Record<string, any> = {};
  for (const [modelName, def] of Object.entries(modelDefinitions)) {
    let modelAttributes: any = {};

    for (const [key, field] of Object.entries(def.schema)) {
      const typedField = field as FieldDefinition;
      const fieldType: any = typeMap[typedField.type.toUpperCase()] || DataTypes.STRING;
      
      modelAttributes[key] = {
        type: fieldType,
        allowNull: typedField.allowNull ?? true,
        unique: typedField.unique ?? false,
      };
    }

    // Define the model
    const model = sequelize.define(modelName, modelAttributes, {
      tableName: def.tableName || modelName.toLowerCase(),
      timestamps: def.timestamps ?? true,
      createdAt: 'created_at', // specify custom field for created timestamp
      updatedAt: 'updated_at', // specify custom field for updated timestamp
      paranoid: def.softDelete ?? false,
      deletedAt: 'deleted_at', // specify custom field for deleted timestamp
      underscored: true, // ensure all column names are in snake_case
    });

    models[modelName] = model;
  }

  // Sync the models and update the database schema if needed
  await sequelize.sync({ alter: true }); // this will update the database schema based on the model

  return { sequelize, models };
}
