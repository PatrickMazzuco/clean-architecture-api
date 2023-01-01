import { MongoHelper } from '../helpers/mongodb.helper';
import { AddAccountRepository } from '@/application/protocols/add-account.repository';

export class AccountMongoRepository implements AddAccountRepository {
  async add(
    accountData: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    const id = result.insertedId;

    return {
      id: id.toString(),
      name: accountData.name,
      email: accountData.email,
      password: accountData.password
    };
  }
}
