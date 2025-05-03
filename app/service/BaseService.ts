import { getSQLModels } from '@system/sqlAdapter'; // dynamic SQL loader
import { getMongoModels } from '@system/mongoAdapter'; // dynamic Mongo loader
import { activeDbType } from '@system/types';

export class BaseService {
  protected static async getUserModel(): Promise<any> {
    if (activeDbType === 'mongo') {
      const cachedMongoModels: any = await getMongoModels();
      return { User: cachedMongoModels.User, softDelete: cachedMongoModels.User.schema.options.softDelete };
    } else {
      const cachedModels = await getSQLModels(activeDbType);
      return { User: cachedModels.User, softDelete: cachedModels.User.schemaOptions?.softDelete };
    }
  }
}