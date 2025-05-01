import fs from 'fs';
import path from 'path';

// Define an interface for the Mongoose model
interface MongooseModel {
  modelName: string;
  // Add other properties from the model that you want to reference here
}

// The 'models' object to store your models
const models: { [key: string]: MongooseModel } = {};
const modelsDir = path.join(__dirname);

// Read and process the files in the models directory
fs.readdirSync(modelsDir).forEach((file) => {
  // Skip certain files (index.js, hidden files, etc.)
  if (
    file === 'index.ts' || // skip self
    path.extname(file) !== '.ts' || // only .ts files
    file.startsWith('.') // skip hidden/system files
  ) return;

  const filePath = path.join(modelsDir, file);
  const model = require(filePath);

  // Only add valid mongoose models (checking if model has a 'modelName')
  if (model && model.modelName) {
    models[model.modelName] = model;
  }
});

// Optionally log to see the models object (for debugging purposes)
// console.log('Models:', models);

export default models;
