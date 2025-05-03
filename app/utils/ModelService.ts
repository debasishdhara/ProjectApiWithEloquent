import { DatabaseService } from '@system/databaseService';
import { ModelConnection } from '@utils/ModelConnection';

export class ModelService extends ModelConnection {
  static async create(modelName: string, data: any) {
    try {
      const { Model, softDelete } = await ModelConnection.getModel(modelName);
      return await DatabaseService.create(Model, data, softDelete);
    } catch (error: any) {
      throw new Error(`Error creating ${modelName}: ${error.message}`);
    }
  }

  static async getAll(modelName: string) {
    try {
      const { Model, softDelete } = await ModelConnection.getModel(modelName);
      return await DatabaseService.get(Model, {}, softDelete);
    } catch (error: any) {
      throw new Error(`Error fetching ${modelName}s: ${error.message}`);
    }
  }

  static async getById(modelName: string, id: string | number) {
    try {
      const { Model, softDelete } = await ModelConnection.getModel(modelName);
      return await DatabaseService.getById(Model, id, softDelete);
    } catch (error: any) {
      throw new Error(`Error fetching ${modelName} by ID: ${error.message}`);
    }
  }

  static async update(modelName: string, id: string | number, data: any) {
    try {
      const { Model } = await ModelConnection.getModel(modelName);
      return await DatabaseService.update(Model, id, data);
    } catch (error: any) {
      throw new Error(`Error updating ${modelName}: ${error.message}`);
    }
  }

  static async delete(modelName: string, id: string | number) {
    try {
      const { Model } = await ModelConnection.getModel(modelName);
      return await DatabaseService.delete(Model, id);
    } catch (error: any) {
      throw new Error(`Error deleting ${modelName}: ${error.message}`);
    }
  }
}
