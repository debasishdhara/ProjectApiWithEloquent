import { getSQLModels } from '@system/sqlAdapter'; // dynamic SQL loader
import { getMongoModels } from '@system/mongoAdapter'; // dynamic Mongo loader
import { DatabaseService, activeDbType } from '@system/databaseService';

export class UserService {
  private static async getUserModel(): Promise<any> {
    if (activeDbType === 'mongo') {
      const cachedMongoModels = await getMongoModels();
      return cachedMongoModels.User;
    } else {
      const cachedModels = await getSQLModels(activeDbType);
      return cachedModels.User;
    }
  }

  static async create(userData: any) {
    try {
      if (!userData.name || !userData.email) {
        throw new Error('Name and email are required');
      }

      const User = await this.getUserModel();
      return await DatabaseService.create(User, userData, User.schema.options.softDelete);
    } catch (error: any) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  static async getAll() {
    try {
      const User = await this.getUserModel();
      if (activeDbType === 'mongo') {
        return await User.find();
      } else {
        return await User.findAll();
      }
    } catch (error: any) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  static async getById(id: string) {
    try {
      const User = await this.getUserModel();
      if (activeDbType === 'mongo') {
        return await User.findById(id);
      } else {
        return await User.findByPk(id);
      }
    } catch (error: any) {
      throw new Error(`Error fetching user by ID: ${error.message}`);
    }
  }

  static async update(id: string | number, userData: any) {
    try {
      const User = await this.getUserModel();
      return await DatabaseService.update(User, id, userData);
    } catch (error: any) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  static async delete(id: string | number) {
    try {
      const User = await this.getUserModel();
      return await DatabaseService.delete(User, id);
    } catch (error: any) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}
