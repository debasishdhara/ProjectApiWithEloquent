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
