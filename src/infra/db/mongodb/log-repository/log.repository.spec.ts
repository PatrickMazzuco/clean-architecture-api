import { Collection, Document } from 'mongodb';

import { MongoHelper } from '../helpers/mongodb.helper';
import { LogMongoRepository } from './log.repository';

describe('Log Mongo Repository', () => {
  let errorsCollection: Collection<Document>;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorsCollection = MongoHelper.getCollection('errors');
    await errorsCollection.deleteMany({});
  });

  const makeSut = (): LogMongoRepository => {
    return new LogMongoRepository();
  };

  it('should create an error log on success', async () => {
    const sut = makeSut();
    await sut.logError({ stack: 'any_stack' });

    const count = await errorsCollection.countDocuments();
    expect(count).toBe(1);
  });
});
