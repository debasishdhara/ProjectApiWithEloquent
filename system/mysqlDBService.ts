import { Model as SequelizeModel, ModelStatic, DestroyOptions } from 'sequelize';
import { CreateOrUpdateData } from '@system/types'; // Import types if necessary

export async function createMySQL<T extends SequelizeModel>(
  model: any,
  data: CreateOrUpdateData,
  softDelete?: boolean
): Promise<any> {
  try {
    return await model.create(data);
  } catch (error: any) {
    throw new Error(`MySQL Create Error: ${error.message}`);
  }
}

export async function updateMySQL<T extends SequelizeModel>(
  model: any,
  id: number | string,
  data: CreateOrUpdateData
): Promise<any> {
  try {
    const [updatedCount, updatedModels] = await model.update(data, {
      where: { id },
      returning: true,
    });

    if (updatedCount === 0) {
      return null;
    }
    return updatedModels[0] || null;
  } catch (error: any) {
    throw new Error(`MySQL Update Error: ${error.message}`);
  }
}

export async function deleteMySQL<T extends SequelizeModel>(
  model: T,
  id: number | string,
  softDelete?: boolean
): Promise<boolean> {
  try {
    if (softDelete) {
      const affectedRows: any = await model.update({ deleted_at: new Date() }, {
        where: { id },
      } as DestroyOptions);
      return affectedRows > 0;
    } else {
      const affectedRows: any = await model.destroy({
        where: { id },
      } as DestroyOptions);
      return affectedRows > 0;
    }
  } catch (error: any) {
    throw new Error(`MySQL Delete Error: ${error.message}`);
  }
}

export async function getMySQL(
  model: ModelStatic<SequelizeModel<any, any>>,
  data: CreateOrUpdateData = {},
  softDelete?: boolean
): Promise<any> {
  const query: any = {
    where: { ...data },
  };

  if (softDelete) {
    query.where.deleted_at = null;
  }

  try {
    const result = await model.findAll(query);
    return result;
  } catch (error) {
    console.error('Error in getMySQL:', error);
    throw error;
  }
}

export async function forceDeleteMySQL<T>(
  model: SequelizeModel,
  id: number | string
): Promise<boolean> {
  try {
    const affectedRows: any = await model.destroy({
      where: { id },
    } as DestroyOptions);
    return affectedRows > 0;
  } catch (error: any) {
    throw new Error(`MySQL Force Delete Error: ${error.message}`);
  }
}


export async function getByIdMySQL<T extends SequelizeModel>(
  model: ModelStatic<T>,
  id: number | string,
  softDelete?: boolean
): Promise<any> {
  try {
    const query: any = {
      where: { id },
    };
    if (softDelete) {
      query.where.deleted_at = null;
    }
    const result = await model.findByPk(query);
    return result;
  } catch (error) {
    console.error('Error in getByIdMySQL:', error);
    throw error;
  }
}