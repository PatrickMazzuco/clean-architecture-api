import { MongoHelper as sut } from './mongodb.helper';

describe('Mongo Helper', () => {
  beforeEach(async () => {
    await sut.connect(process.env.MONGO_URL as string);
  });

  afterEach(async () => {
    if (sut.client) await sut.disconnect();
  });

  it('should reconnect if connection was lost', async () => {
    let accountCollection = sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();

    await sut.client?.close();
    accountCollection = sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
  });

  it('should throw an error if connection was closed manually', async () => {
    await sut.disconnect();
    expect(() => sut.getCollection('accounts')).toThrow();
  });
});
