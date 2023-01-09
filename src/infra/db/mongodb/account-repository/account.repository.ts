import { ObjectId } from 'mongodb';

import { MongoHelper } from '../helpers/mongodb.helper';
import { AccountMongo } from '../models/account.model';
import { AccountMapper } from './account.mapper';
import { IAddAccountRepository } from '@/application/protocols/db/account/add-account.repository';
import { IFindAccountByEmailRepository } from '@/application/protocols/db/account/find-account-by-email.repository';
import { IFindAccountByIdRepository } from '@/application/protocols/db/account/find-account-by-id.repository';
import { IUpdateAccessTokenRepository } from '@/application/protocols/db/account/update-access-token.repository';

export class AccountMongoRepository
  implements
    IAddAccountRepository,
    IFindAccountByEmailRepository,
    IUpdateAccessTokenRepository,
    IFindAccountByIdRepository
{
  async add(
    accountData: IAddAccountRepository.Params
  ): Promise<IAddAccountRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    const id = result.insertedId;

    return AccountMapper.toEntity({ _id: id, ...accountData });
  }

  async findByEmail(
    email: string
  ): Promise<IFindAccountByEmailRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const result = await accountCollection.findOne<AccountMongo>({
      email
    });

    if (!result) {
      return null;
    }

    return AccountMapper.toEntity(result);
  }

  async findById(id: string): Promise<IFindAccountByIdRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const result = await accountCollection.findOne<AccountMongo>({
      _id: new ObjectId(id)
    });

    if (!result) {
      return null;
    }

    return AccountMapper.toEntity(result);
  }

  async updateAccessToken(
    params: IUpdateAccessTokenRepository.Params
  ): Promise<IUpdateAccessTokenRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { accessToken: params.accessToken } }
    );
  }
}
