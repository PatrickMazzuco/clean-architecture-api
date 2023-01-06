import { AccountMongo } from '../../models/Account.model';
import { MongoHelper } from '../helpers/mongodb.helper';
import { AccountMapper } from './account.mapper';
import { AddAccountRepository } from '@/application/protocols/db/add-account.repository';
import { FindAccountByEmailRepository } from '@/application/protocols/db/find-account-by-email.repository';

export class AccountMongoRepository
  implements AddAccountRepository, FindAccountByEmailRepository
{
  async add(
    accountData: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    const id = result.insertedId;

    return AccountMapper.toEntity({ _id: id, ...accountData });
  }

  async findByEmail(
    email: string
  ): Promise<FindAccountByEmailRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const result = await accountCollection.findOne<AccountMongo>({
      email
    });

    if (!result) {
      return null;
    }

    return AccountMapper.toEntity(result);
  }
}
