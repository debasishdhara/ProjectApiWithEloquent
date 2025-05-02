import dotenv from 'dotenv';
import mongoose, { Model as MongooseModel } from 'mongoose';
import { DestroyOptions, ModelStatic, Model as SequelizeModel } from 'sequelize';

// Initialize dotenv
dotenv.config();

// Define database type
export type DBType = 'mongo' | 'mysql' | 'postgres' | 'sqlite';

// Active DB Type, defaulted from environment variable
export const activeDbType: DBType = (process.env.ACTIVE_DB as DBType) || 'mysql';

// Define a type for the create/update data
interface CreateOrUpdateData {
  [key: string]: any;
}

// Define a generic database service class
export class DatabaseService {
  // MongoDB create
  static async createMongo<T>(model: MongooseModel<T>, data: CreateOrUpdateData,softDelete?:boolean): Promise<any> {
    try {
      if(softDelete){
        const newDocument = new model({
          ...data,
          deleted_at: null, // explicitly set if softDelete is used
        });
        return await newDocument.save();
      }else{
        const newDocument = new model(data);
        return await newDocument.save();
      }
    } catch (error: any) {
      throw new Error(`MongoDB Create Error: ${error.message}`);
    }
  }

  // MongoDB update (find by ID and update)
  static async updateMongo<T>(
    model: MongooseModel<any>,
    id: string,
    data: CreateOrUpdateData
  ): Promise<any> {
    try {
      return await model.findByIdAndUpdate(id, data, { new: true });
    } catch (error: any) {
      throw new Error(`MongoDB Update Error: ${error.message}`);
    }
  }

  // MongoDB delete
  static async deleteMongo<T>(model: MongooseModel<T>, id: string,softDelete?:boolean): Promise<boolean> {
    try {
      if(softDelete){
        const result = await model.findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true });
        return result !== null;
      }else{
        const result = await model.findByIdAndDelete(id);
        return result !== null;
      }
    } catch (error: any) {
      throw new Error(`MongoDB Delete Error: ${error.message}`);
    }
  }

  // MySQL create
  static async createMySQL<T extends SequelizeModel>(
    model: any,
    data: CreateOrUpdateData,
    softDelete?:boolean
  ): Promise<any> {
    try {
      return await model.create(data);
    } catch (error: any) {
      throw new Error(`MySQL Create Error: ${error.message}`);
    }
  }

  // MySQL update
  static async updateMySQL<T extends SequelizeModel>(
    model: any,
    id: number | string,
    data: CreateOrUpdateData
  ): Promise<any> {
    try {
      const [updatedCount, updatedModels] = await model.update(data, {
        where: { id },
        returning: true, // This returns the updated rows
      });

      if (updatedCount === 0) {
        return null;
      }
      return updatedModels[0] || null;
    } catch (error: any) {
      throw new Error(`MySQL Update Error: ${error.message}`);
    }
  }

  // MySQL delete
  static async deleteMySQL<T extends SequelizeModel>(
    model: T,
    id: number | string,
    softDelete?:boolean
  ): Promise<boolean> {
    try {
      if(softDelete){
        const affectedRows:any = await model.update({ deleted_at: new Date() }, {
          where: { id },
        } as DestroyOptions);
        return affectedRows > 0;
      }else{
        const affectedRows:any = await model.destroy({
          where: { id },
        } as DestroyOptions);
        return affectedRows > 0;
      }
    } catch (error: any) {
      throw new Error(`MySQL Delete Error: ${error.message}`);
    }
  }

  // Generic function for handling CRUD for both MongoDB and MySQL
  static async create<T>(
    model: MongooseModel<T> | SequelizeModel,
    data: CreateOrUpdateData,
    softDelete?: boolean
  ): Promise<any>  {
    if (activeDbType === 'mongo') {
      return this.createMongo(model as MongooseModel<T>, data,softDelete);
    } else {
      return this.createMySQL(model as SequelizeModel, data,softDelete);
    }
  }

  static async update<T>(
    model: MongooseModel<T> | SequelizeModel,
    id: string | number,
    data: CreateOrUpdateData
  ): Promise<any> {
    if (activeDbType === 'mongo') {
      return this.updateMongo(model as MongooseModel<T>, id as string, data);
    } else {
      return this.updateMySQL(model as SequelizeModel, id as number, data);
    }
  }

  static async delete<T>(
    model: MongooseModel<T> | SequelizeModel,
    id: string | number,
    softDelete?: boolean
  ): Promise<boolean> {
    if (activeDbType === 'mongo') {
      return this.deleteMongo(model as MongooseModel<T>, id as string,softDelete);
    } else {
      return this.deleteMySQL(model as SequelizeModel, id as number,softDelete);
    }
  }


  // Generic both mongo and mysql get function with soft delete
  static async getMongo<T>(
    model: MongooseModel<T>,
    data: CreateOrUpdateData = {},
    softDelete?: boolean
  ): Promise<any> {
    const query: Record<string, any> = {};
  
    // Only add data fields to query if data exists
    if (Object.keys(data).length > 0) {
      Object.assign(query, data);
    }
  
    // Apply soft delete filtering if required
    if (softDelete) {
      query.deleted_at = null;
    }
  
    // Return the result
    return await model.find(query).exec();
  }
  
  static async getMySQL(
    model: ModelStatic<SequelizeModel<any, any>>,
    data: CreateOrUpdateData = {},
    softDelete?: boolean
  ): Promise<any> {
    const query: any = {
      where: { ...data },
    };
  
    // Apply soft delete logic if enabled
    if (softDelete) {
      query.where.deleted_at = null; // Assuming `paranoid` mode is used
    }
  
    try {
      const result = await model.findAll(query);
      return result;
    } catch (error) {
      console.error('Error in getMySQL:', error);
      throw error;
    }
  }
     
  static async get<T>(
    model: MongooseModel<T> | ModelStatic<SequelizeModel<any, any>>,
    data: CreateOrUpdateData,
    softDelete?: boolean
  ): Promise<any> {
    if (activeDbType === 'mongo') {
      return this.getMongo(model as MongooseModel<T>, data, softDelete);
    } else {
      return this.getMySQL(model as ModelStatic<SequelizeModel<any, any>>, data, softDelete);
    }
  }
  
  // force delete for both mongo and mysql
  static async forceDelete<T>(
    model: MongooseModel<T> | SequelizeModel,
    id: string | number
  ): Promise<boolean> {
    if (activeDbType === 'mongo') {
      return this.deleteMongo(model as MongooseModel<T>, id as string,false);
    }else {
      return this.deleteMySQL(model as SequelizeModel, id as number,false);
    }
  }
}
