import { MongoHelper } from '../helpers/mongodb.helper';
import { LogErrorRepository } from '@/application/protocols/log-error.repository';

export class LogMongoRepository implements LogErrorRepository {
  async logError({
    stack
  }: LogErrorRepository.Params): Promise<LogErrorRepository.Result> {
    await MongoHelper.getCollection('errors').insertOne({
      stack,
      date: new Date()
    });
  }
}
