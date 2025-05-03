
import { ModelService } from '@utils/ModelService';

export class UserService{
  static async create(data: any) {
    if (!data.name || !data.email) {
      throw new Error('Name and email are required');
    }
    return await ModelService.create('User', data);
  }

  static async getAll() {
    return await ModelService.getAll('User');
  }

  static async getById(id: string | number) {
    return await ModelService.getById('User', id);
  }

  static async update(id: string | number, data: any) {
    return await ModelService.update('User', id, data);
  }

  static async delete(id: string | number) {
    return await ModelService.delete('User', id);
  }
}
