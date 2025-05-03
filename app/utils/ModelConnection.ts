import { getSQLModels } from '@system/sqlAdapter'; // dynamic SQL loader
import { getMongoModels } from '@system/mongoAdapter'; // dynamic Mongo loader
import { activeDbType } from '@system/types';

export class ModelConnection {
  protected static async getModel(Model:any): Promise<any> {
    if (activeDbType === 'mongo') {
      const cachedMongoModels: any = await getMongoModels();
      return { [Model]: cachedMongoModels[Model], softDelete: cachedMongoModels[Model].schema.options.softDelete };
    } else {
      const cachedModels = await getSQLModels(activeDbType);
      return { [Model]: cachedModels[Model], softDelete: cachedModels[Model].schemaOptions?.softDelete };
    }
  }
}