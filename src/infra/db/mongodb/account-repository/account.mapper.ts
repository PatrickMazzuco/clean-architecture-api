import { ObjectId } from 'mongodb';

import { AccountMongo, AccountRoleMongo } from '../models/account.model';
import { Account, AccountRole } from '@/domain/entities';

export class AccountMapper {
  static toEntity(data: AccountMongo): Account {
    const role = mapRoleToEntity(data.role);

    return {
      id: data._id.toString(),
      name: data.name,
      email: data.email,
      password: data.password,
      accessToken: data.accessToken,
      role
    };
  }

  static toDatabase(data: Account): AccountMongo {
    const role = mapRoleToDatabase(data.role);

    return {
      _id: new ObjectId(data.id),
      name: data.name,
      email: data.email,
      password: data.password,
      accessToken: data.accessToken,
      role
    };
  }
}

const mapRoleToEntity = (role?: AccountRoleMongo): AccountRole => {
  switch (role) {
    case AccountRoleMongo.ADMIN:
      return AccountRole.ADMIN;
    case AccountRoleMongo.USER:
      return AccountRole.USER;
    default:
      return AccountRole.USER;
  }
};

const mapRoleToDatabase = (role?: AccountRole): AccountRoleMongo => {
  switch (role) {
    case AccountRole.ADMIN:
      return AccountRoleMongo.ADMIN;
    case AccountRole.USER:
      return AccountRoleMongo.USER;
    default:
      return AccountRoleMongo.USER;
  }
};
