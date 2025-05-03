
import { DatabaseService } from '@system/databaseService';
import { ModelConnection } from '@utils/ModelConnection';

export class UserService extends ModelConnection{
  constructor() {
    super();
  }
  static async create(userData: any) {
    try {
      if (!userData.name || !userData.email) {
        throw new Error('Name and email are required');
      }
      const {User,softDelete} = await ModelConnection.getModel('User');
      return await DatabaseService.create(User, userData, softDelete);
    } catch (error: any) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  static async getAll() {
    try {
      const {User,softDelete} = await ModelConnection.getModel('User');
      return await DatabaseService.get(User,{}, softDelete);
    } catch (error: any) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  static async getById(id: string) {
    try {
      const {User,softDelete} = await ModelConnection.getModel('User');
      return await DatabaseService.getById(User, id, softDelete);
    } catch (error: any) {
      throw new Error(`Error fetching user by ID: ${error.message}`);
    }
  }

  static async update(id: string | number, userData: any) {
    try {
      const {User,softDelete} = await ModelConnection.getModel('User');
      return await DatabaseService.update(User, id, userData);
    } catch (error: any) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  static async delete(id: string | number) {
    try {
      const {User,softDelete} = await ModelConnection.getModel('User');
      return await DatabaseService.delete(User, id);
    } catch (error: any) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}
