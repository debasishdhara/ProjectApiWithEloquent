// @ts-ignore
import { ModelService } from '@utils/ModelService';

export class MBaseService{
  static async create(data: any) {
    if (!data.name || !data.email) {
      throw new Error('Name and email are required');
    }
    return await ModelService.create('MBase', data);
  }

  static async getAll() {
    return await ModelService.getAll('MBase');
  }

  static async getById(id: string | number) {
    return await ModelService.getById('MBase', id);
  }

  static async update(id: string | number, data: any) {
    return await ModelService.update('MBase', id, data);
  }

  static async delete(id: string | number) {
    return await ModelService.delete('MBase', id);
  }
}
