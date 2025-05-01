import { connectSQL } from '@system/sqlAdapter'; // dynamic SQL loader
import { connectMongo } from '@system/mongoAdapter'; // dynamic Mongo loader
import { DatabaseService, activeDbType } from '@system/databaseService';

export class UserService {
  private static async getUserModel(): Promise<any> {
    if (activeDbType === 'mongo') {
      const {models} = await connectMongo();
      return models.User;
    } else {
      const {models} = await connectSQL(activeDbType);
      return models.User;
    }
  }

  static async create(userData: any) {
    try {
      if (!userData.username || !userData.email) {
        throw new Error('Username and email are required');
      }

      const User = await this.getUserModel();
      return await DatabaseService.create(User, userData);
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
