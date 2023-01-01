import { ObjectId } from 'mongodb';

import { Account } from '@/domain/entities';

type AccountMongo = {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
};

export class AccountMapper {
  static toEntity(data: AccountMongo): Account {
    return {
      id: data._id.toString(),
      name: data.name,
      email: data.email,
      password: data.password
    };
  }
}
