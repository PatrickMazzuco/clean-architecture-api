import { MongoHelper } from '../helpers/mongodb.helper';
import { AccountMongoRepository } from './account.repository';

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  it('should return an account on success', async () => {
    const sut = makeSut();
    const accountData = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    };

    const account = await sut.add(accountData);

    expect(account).toBeTruthy();
    expect(account).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: accountData.name,
        email: accountData.email,
        password: accountData.password
      })
    );
  });
});
