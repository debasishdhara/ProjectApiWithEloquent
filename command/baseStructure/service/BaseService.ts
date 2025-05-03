
// import { ModelService } from '@utils/ModelService';

export class MBaseService{
  static async create(data: any) {
    if (!data.name || !data.email) {
      throw new Error('Name and email are required');
    }
    return await ('ModelService' as any).create('MBase', data);
  }

  static async getAll() {
    return await ('ModelService' as any).getAll('MBase');
  }

  static async getById(id: string | number) {
    return await ('ModelService' as any).getById('MBase', id);
  }

  static async update(id: string | number, data: any) {
    return await ('ModelService' as any).update('MBase', id, data);
  }

  static async delete(id: string | number) {
    return await ('ModelService' as any).delete('MBase', id);
  }
}
