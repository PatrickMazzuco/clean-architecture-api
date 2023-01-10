/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MongoHelper } from '../helpers/mongodb.helper';
import { AccountMongo } from '../models/account.model';
import { AccountMongoRepository } from './account.repository';
import { AccountRole } from '@/domain/entities';

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

  it('should return an account on add success', async () => {
    const sut = makeSut();
    const accountData = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
      role: AccountRole.USER
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

  it('should return an account on findByEmail success', async () => {
    const sut = makeSut();
    const accountData = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    };

    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.insertOne(accountData);

    const foundAccount = await sut.findByEmail(accountData.email);

    expect(foundAccount).toBeTruthy();
    expect(foundAccount).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: accountData.name,
        email: accountData.email,
        password: accountData.password
      })
    );
  });

  it("should return null on findByEmail if user doesn't exist", async () => {
    const sut = makeSut();
    const accountData = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    };

    const foundAccount = await sut.findByEmail(accountData.email);

    expect(foundAccount).toBeNull();
  });

  it('should return an account on findById success', async () => {
    const sut = makeSut();
    const accountData = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    };

    const accountCollection = MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    const id = result.insertedId;

    const foundAccount = await sut.findById(id.toString());

    expect(foundAccount).toBeTruthy();
    expect(foundAccount).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: accountData.name,
        email: accountData.email,
        password: accountData.password
      })
    );
  });

  it("should return null on findById if user doesn't exist", async () => {
    const sut = makeSut();
    const mockId = '5f9f1c9b9c9c9c9c9c9c9c9c';

    const foundAccount = await sut.findById(mockId);

    expect(foundAccount).toBeNull();
  });

  it('should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut();
    const accountData = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    };
    const accessToken = 'any_token';

    const accountCollection = MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    const id = result.insertedId;

    await sut.updateAccessToken({
      id: id.toString(),
      accessToken
    });

    const foundAccount = await accountCollection.findOne<AccountMongo>({
      _id: id
    });

    expect(foundAccount).toBeTruthy();
    expect(foundAccount!.accessToken).toBe(accessToken);
  });
});
