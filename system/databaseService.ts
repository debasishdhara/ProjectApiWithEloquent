import { Model as MongooseModel } from 'mongoose';
import { Model as SequelizeModel, ModelStatic } from 'sequelize';
import { CreateOrUpdateData } from '@system/types'; // Import types if necessary

// Define the active DB type
export type DBType = 'mongo' | 'mysql' | 'postgres' | 'sqlite';
export const activeDbType: DBType = (process.env.ACTIVE_DB as DBType) || 'mysql';

// Database service with common functions
export class DatabaseService {
  static async create<T>(
    model: MongooseModel<T> | SequelizeModel,
    data: CreateOrUpdateData,
    softDelete?: boolean
  ): Promise<any> {
    if (activeDbType === 'mongo') {
      const { createMongo } = await import('@system/mongoDBService');
      return createMongo(model as MongooseModel<T>, data, softDelete);
    } else {
      const { createMySQL } = await import('@system/mysqlDBService');
      return createMySQL(model as SequelizeModel, data, softDelete);
    }
  }

  static async update<T>(
    model: MongooseModel<T> | SequelizeModel,
    id: string | number,
    data: CreateOrUpdateData
  ): Promise<any> {
    if (activeDbType === 'mongo') {
      const { updateMongo } = await import('@system/mongoDBService');
      return updateMongo(model as MongooseModel<T>, id as string, data);
    } else {
      const { updateMySQL } = await import('@system/mysqlDBService');
      return updateMySQL(model as SequelizeModel, id as number, data);
    }
  }

  static async delete<T>(
    model: MongooseModel<T> | SequelizeModel,
    id: string | number,
    softDelete?: boolean
  ): Promise<boolean> {
    if (activeDbType === 'mongo') {
      const { deleteMongo } = await import('@system/mongoDBService');
      return deleteMongo(model as MongooseModel<T>, id as string, softDelete);
    } else {
      const { deleteMySQL } = await import('@system/mysqlDBService');
      return deleteMySQL(model as SequelizeModel, id as number, softDelete);
    }
  }

  static async get<T>(
    model: MongooseModel<T> | ModelStatic<SequelizeModel<any, any>>,
    data: CreateOrUpdateData,
    softDelete?: boolean
  ): Promise<any> {
    if (activeDbType === 'mongo') {
      const { getMongo } = await import('@system/mongoDBService');
      return getMongo(model as MongooseModel<T>, data, softDelete);
    } else {
      const { getMySQL } = await import('@system/mysqlDBService');
      return getMySQL(model as ModelStatic<SequelizeModel<any, any>>, data, softDelete);
    }
  }

  static async getById<T>(
    model: MongooseModel<T> | ModelStatic<SequelizeModel<any, any>>,
    id: string | number,
    softDelete?: boolean
  ): Promise<any> {
    if (activeDbType === 'mongo') {
      const { getByIdMongo } = await import('@system/mongoDBService');
      return getByIdMongo(model as MongooseModel<T>, id as string, softDelete);
    } else {
      const { getByIdMySQL } = await import('@system/mysqlDBService');
      return getByIdMySQL(model as ModelStatic<SequelizeModel<any, any>>, id as number, softDelete);
    }
  }
  static async forceDelete<T>(
    model: MongooseModel<T> | SequelizeModel,
    id: string | number
  ): Promise<boolean> {
    if (activeDbType === 'mongo') {
      const { forceDeleteMongo } = await import('@system/mongoDBService');
      return forceDeleteMongo(model as MongooseModel<T>, id as string);
    } else {
      const { forceDeleteMySQL } = await import('@system/mysqlDBService');
      return forceDeleteMySQL(model as SequelizeModel, id as number);
    }
  }
}
