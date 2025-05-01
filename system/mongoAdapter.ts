// system/mongoAdapter.ts

import mongoose, { Schema } from 'mongoose';
import { dbConfig } from '@config/config';
import { loadModels } from './modelLoader';


// Mapping Sequelize types to Mongoose Schema types
const typeMap: Record<string, any> = {
    STRING: String,
    TEXT: String,
    INTEGER: Number,
    BIGINT: Number,
    FLOAT: Number,
    DOUBLE: Number,
    DECIMAL: Number,
    BOOLEAN: Boolean,
    DATE: Date,
    DATEONLY: Date,
    TIME: String,  // Time would usually be represented as a String or Date in MongoDB
    UUID: String,  // UUID could be stored as a String
    UUIDV4: String,
    JSON: Object,   // Mongoose stores JSON objects as Object type
    JSONB: Object,  // Same for JSONB in PostgreSQL
    ENUM: String,   // We can use String and restrict values via enum options
    BLOB: Buffer,   // Blob could be stored as a Buffer
};

export async function connectMongo() {
  // Connect to MongoDB using Mongoose
  await mongoose.connect(dbConfig.connections.mongo.uri);
  console.log('MongoDB connected');

  // Load models dynamically (ensure models are exported correctly)
  const models = await loadModels();

  // Register models with Mongoose
  Object.values(models).forEach((model: any) => {
    if (model.schema && model.modelName) {
      const mongooseSchemaDef: Record<string, any> = {};
  
      for (const [field, config] of Object.entries(model.schema)) {
        const fieldConfig: any = {};
        const cfg = config as { type: string; allowNull?: boolean; unique?: boolean };
        // Map type
        const mongooseType = typeMap[cfg.type];
        if (!mongooseType) {
          console.warn(`Unsupported type "${cfg.type}" in model "${model.modelName}" field "${field}"`);
          continue;
        }
  
        fieldConfig.type = mongooseType;
  
        // Convert allowNull → required
        if (cfg.allowNull === false) {
          fieldConfig.required = true;
        }
  
        // Preserve other options like `unique`
        if (cfg.unique) {
          fieldConfig.unique = true;
        }
  
        mongooseSchemaDef[field] = fieldConfig;
      }
  
      const schemaOptions: mongoose.SchemaOptions = {
        timestamps: model.timestamps || false,
        versionKey: false,
        collection: model.tableName || undefined,
      };
  
      const mongooseSchema = new Schema(mongooseSchemaDef, schemaOptions);
      mongoose.model(model.modelName, mongooseSchema);
    }
  });

  return mongoose;
}

export function convertMongoModelsToSwaggerSchemas(models: Record<string, any>) {
    const schemas: Record<string, any> = {};
  
    for (const [modelName, model] of Object.entries(models)) {
      const properties: Record<string, any> = {};
      const required: string[] = [];
  
      for (const [field, config] of Object.entries(model.schema)) {
        const fieldConfig = config as { type: string; allowNull?: boolean; unique?: boolean };
        const swaggerField: Record<string, any> = {};
  
        switch (fieldConfig.type) {
          case 'STRING':
          case 'TEXT':
          case 'UUID':
          case 'UUIDV4':
          case 'TIME':
          case 'ENUM':
            swaggerField.type = 'string';
            break;
          case 'INTEGER':
          case 'BIGINT':
          case 'FLOAT':
          case 'DOUBLE':
          case 'DECIMAL':
            swaggerField.type = 'number';
            break;
          case 'BOOLEAN':
            swaggerField.type = 'boolean';
            break;
          case 'DATE':
          case 'DATEONLY':
            swaggerField.type = 'string';
            swaggerField.format = 'date-time';
            break;
          case 'JSON':
          case 'JSONB':
            swaggerField.type = 'object';
            break;
          case 'BLOB':
            swaggerField.type = 'string';
            swaggerField.format = 'binary';
            break;
          default:
            swaggerField.type = 'string';
        }
  
        if (fieldConfig.unique) {
          swaggerField.uniqueItems = true; // Not a true Swagger property, but can be documented
        }
  
        if (fieldConfig.allowNull === false) {
          required.push(field);
        }
  
        properties[field] = swaggerField;
      }
  
      schemas[modelName] = {
        type: 'object',
        properties,
        ...(required.length > 0 ? { required } : {}),
      };
    }
  
    return schemas;
}
  