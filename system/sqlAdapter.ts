// system/sqlAdapter.ts
import { dbConfig } from '@config/config';
import { Sequelize, DataTypes, DataType, ModelStatic, Model } from 'sequelize';
import { loadModels } from './modelLoader';
import dotenv from 'dotenv';
dotenv.config();
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
interface CustomModelStatic extends ModelStatic<Model> {
  schemaOptions?: {
    softDelete?: boolean;
    timestamps?: boolean;
    tableName?: string;
  };
}

let cachedModels:any = null;
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
    (model as CustomModelStatic).schemaOptions = {
      softDelete: def.softDelete ?? false,
      timestamps: def.timestamps ?? true,
      tableName: def.tableName || modelName.toLowerCase(),
    };
    models[modelName] = model;
  }

  // Sync the models and update the database schema if needed
  await sequelize.sync(); // this will update the database schema based on the model
  cachedModels = models;
  return { sequelize, cachedModels };
}


let sequelize: Sequelize | null = null;
// for migration ppurposes need to refresh the models
export async function refreshSQLModels(databaseType: 'mysql' | 'postgres' | 'sqlite') {
  if (!sequelize) {
    const conn = await connectSQL(databaseType);
    sequelize = conn.sequelize;
  }

  const modelDefinitions = await loadModels();
  cachedModels = cachedModels || {};

  for (const [modelName, def] of Object.entries(modelDefinitions)) {
    if (cachedModels[modelName]) continue;

    const modelAttributes: any = {};
    for (const [key, field] of Object.entries(def.schema)) {
      const typedField = field as FieldDefinition;
      const fieldType: any = typeMap[typedField.type.toUpperCase()] || DataTypes.STRING;
      
      modelAttributes[key] = {
        type: fieldType,
        allowNull: typedField.allowNull ?? true,
        unique: typedField.unique ?? false,
      };
    }

    const model = sequelize.define(modelName, modelAttributes, {
      tableName: def.tableName || modelName.toLowerCase(),
      timestamps: def.timestamps ?? true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: def.softDelete ?? false,
      deletedAt: 'deleted_at',
      underscored: true,
    });

    (model as CustomModelStatic).schemaOptions = {
      softDelete: def.softDelete ?? false,
      timestamps: def.timestamps ?? true,
      tableName: def.tableName || modelName.toLowerCase(),
    };

    cachedModels[modelName] = model;
  }

  // Alter the models and schema without deleting data
  await sequelize.sync({ alter: true }); // This safely updates the schema
  return cachedModels;
}

export async function getSQLModels(DBType: 'mysql' | 'postgres' | 'sqlite') {
  if (!cachedModels) {
    const { cachedModels } = await connectSQL(DBType);
  }
  return cachedModels;
}
