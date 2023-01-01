import { MongoHelper } from '../helpers/mongodb.helper';
import { AccountMapper } from './account.mapper';
import { AddAccountRepository } from '@/application/protocols/add-account.repository';

export class AccountMongoRepository implements AddAccountRepository {
  async add(
    accountData: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    const id = result.insertedId;

    return AccountMapper.toEntity({ _id: id, ...accountData });
  }
}
