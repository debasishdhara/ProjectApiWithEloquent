import { Model as MongooseModel } from 'mongoose';
import { CreateOrUpdateData } from '@system/types'; // Import types if necessary

export async function createMongo<T>(
  model: MongooseModel<T>,
  data: CreateOrUpdateData,
  softDelete?: boolean
): Promise<any> {
  try {
    if (softDelete) {
      const newDocument = new model({
        ...data,
        deleted_at: null,
      });
      return await newDocument.save();
    } else {
      const newDocument = new model(data);
      return await newDocument.save();
    }
  } catch (error: any) {
    throw new Error(`MongoDB Create Error: ${error.message}`);
  }
}

export async function updateMongo<T>(
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

export async function deleteMongo<T>(
  model: MongooseModel<T>,
  id: string,
  softDelete?: boolean
): Promise<boolean> {
  try {
    if (softDelete) {
      const result = await model.findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true });
      return result !== null;
    } else {
      const result = await model.findByIdAndDelete(id);
      return result !== null;
    }
  } catch (error: any) {
    throw new Error(`MongoDB Delete Error: ${error.message}`);
  }
}

export async function getMongo<T>(
  model: MongooseModel<T>,
  data: CreateOrUpdateData = {},
  softDelete?: boolean
): Promise<any> {
  const query: Record<string, any> = {};

  if (Object.keys(data).length > 0) {
    Object.assign(query, data);
  }

  if (softDelete) {
    query.deleted_at = null;
  }

  return await model.find(query).exec();
}

export async function forceDeleteMongo<T>(
  model: MongooseModel<T>,
  id: string
): Promise<boolean> {
  try {
    const result = await model.findByIdAndDelete(id);
    return result !== null;
  } catch (error: any) {
    throw new Error(`MongoDB Force Delete Error: ${error.message}`);
  }
}

export async function getByIdMongo<T>(
  model: MongooseModel<T>,
  id: string,
  softDelete?: boolean
): Promise<any> {
  try {
    if (softDelete) {
      return await model.findById(id).where('deleted_at').equals(null).exec();
    }
    return await model.findById(id).exec();
  } catch (error: any) {
    throw new Error(`MongoDB Get By ID Error: ${error.message}`);
  }
}