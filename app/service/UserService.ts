import { getSQLModels } from '@system/sqlAdapter'; // dynamic SQL loader
import { getMongoModels } from '@system/mongoAdapter'; // dynamic Mongo loader
import { DatabaseService } from '@system/databaseService';
import { activeDbType } from '@system/types';

export class UserService {
  private static async getUserModel(): Promise<any> {
    if (activeDbType === 'mongo') {
      const cachedMongoModels:any = await getMongoModels();
      return {User:cachedMongoModels.User, softDelete: cachedMongoModels.User.schema.options.softDelete};
    } else {
      const cachedModels = await getSQLModels(activeDbType);
      return {User:cachedModels.User, softDelete: cachedModels.User.schemaOptions?.softDelete};
    }
  }

  static async create(userData: any) {
    try {
      if (!userData.name || !userData.email) {
        throw new Error('Name and email are required');
      }

      const {User,softDelete} = await this.getUserModel();
      return await DatabaseService.create(User, userData, softDelete);
    } catch (error: any) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  static async getAll() {
    try {
      const {User,softDelete} = await this.getUserModel();
      return await DatabaseService.get(User,{}, softDelete);
    } catch (error: any) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  static async getById(id: string) {
    try {
      const {User,softDelete} = await this.getUserModel();
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
      const {User,softDelete} = await this.getUserModel();
      return await DatabaseService.update(User, id, userData);
    } catch (error: any) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  static async delete(id: string | number) {
    try {
      const {User,softDelete} = await this.getUserModel();
      return await DatabaseService.delete(User, id);
    } catch (error: any) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}
