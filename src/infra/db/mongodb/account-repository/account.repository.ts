import { ObjectId } from 'mongodb';

import { AccountMongo } from '../../models/Account.model';
import { MongoHelper } from '../helpers/mongodb.helper';
import { AccountMapper } from './account.mapper';
import { AddAccountRepository } from '@/application/protocols/db/add-account.repository';
import { FindAccountByEmailRepository } from '@/application/protocols/db/find-account-by-email.repository';
import { UpdateAccessTokenRepository } from '@/application/protocols/db/update-access-token.repository';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    FindAccountByEmailRepository,
    UpdateAccessTokenRepository
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

  async updateAccessToken(
    params: UpdateAccessTokenRepository.Params
  ): Promise<UpdateAccessTokenRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { accessToken: params.accessToken } }
    );
  }
}
