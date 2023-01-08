import { MongoHelper } from '../helpers/mongodb.helper';
import { ILogErrorRepository } from '@/application/protocols/db/log/log-error.repository';

export class LogMongoRepository implements ILogErrorRepository {
  async logError({
    stack
  }: ILogErrorRepository.Params): Promise<ILogErrorRepository.Result> {
    await MongoHelper.getCollection('errors').insertOne({
      stack,
      date: new Date()
    });
  }
}
