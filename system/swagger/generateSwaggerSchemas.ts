// utils/generateSwaggerSchemas.ts
export interface FieldDefinition {
    type: string;
    allowNull?: boolean;
    unique?: boolean;
  }
  
  export interface ModelDefinition {
    modelName: string;
    schema: Record<string, FieldDefinition>;
    tableName?: string;
    timestamps?: boolean;
  }
  
  const typeMap: Record<string, any> = {
    STRING: { type: 'string' },
    TEXT: { type: 'string' },
    INTEGER: { type: 'integer', format: 'int32' },
    BIGINT: { type: 'integer', format: 'int64' },
    FLOAT: { type: 'number', format: 'float' },
    DOUBLE: { type: 'number', format: 'double' },
    DECIMAL: { type: 'number' },
    BOOLEAN: { type: 'boolean' },
    DATE: { type: 'string', format: 'date-time' },
    DATEONLY: { type: 'string', format: 'date' },
    TIME: { type: 'string' },
    UUID: { type: 'string', format: 'uuid' },
    UUIDV4: { type: 'string', format: 'uuid' },
    JSON: { type: 'object' },
    JSONB: { type: 'object' },
    ENUM: { type: 'string' },
    BLOB: { type: 'string', format: 'binary' },
  };
  
  export function generateSwaggerSchemas(models: Record<string, ModelDefinition>) {
    const schemas: Record<string, any> = {};
  
    for (const modelName in models) {
      const model = models[modelName];
      const properties: Record<string, any> = {};
      const required: string[] = [];
  
      for (const [fieldName, fieldDef] of Object.entries(model.schema)) {
        const baseType = typeMap[fieldDef.type.toUpperCase()];
        if (!baseType) {
          console.warn(`Unknown type "${fieldDef.type}" in model "${modelName}"`);
          continue;
        }
  
        properties[fieldName] = { ...baseType };
        if (fieldDef.unique) {
          properties[fieldName].unique = true;
        }
  
        if (fieldDef.allowNull === false) {
          required.push(fieldName);
        }
      }
  
      schemas[modelName] = {
        type: 'object',
        properties,
        ...(required.length > 0 ? { required } : {}),
      };
    }
  
    return schemas;
  }
  