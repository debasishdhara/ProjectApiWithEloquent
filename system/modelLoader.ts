// system/modelLoader.ts
import fs from 'fs';
import path from 'path';

export const loadModels = async () => {
  const modelsDir = path.join(__dirname, '../app/model');
  const models: { [key: string]: any } = {};

  const files = fs.readdirSync(modelsDir);

  for (const file of files) {
    if (
      file.startsWith('.') || 
      file === 'index.ts' || 
      !file.endsWith('.ts')
    ) continue;

    const filePath = path.join(modelsDir, file);
    const model = await import(filePath);

    if (model && model.modelName) {
      models[model.modelName] = model;
    }
  }

  return models;
};
