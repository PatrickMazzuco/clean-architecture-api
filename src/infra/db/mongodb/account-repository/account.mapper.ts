import { ObjectId } from 'mongodb';

import { AccountMongo } from '../models/account.model';
import { Account } from '@/domain/entities';

export class AccountMapper {
  static toEntity(data: AccountMongo): Account {
    return {
      id: data._id.toString(),
      name: data.name,
      email: data.email,
      password: data.password,
      accessToken: data.accessToken
    };
  }

  static toDatabase(data: Account): AccountMongo {
    return {
      _id: new ObjectId(data.id),
      name: data.name,
      email: data.email,
      password: data.password,
      accessToken: data.accessToken
    };
  }
}
