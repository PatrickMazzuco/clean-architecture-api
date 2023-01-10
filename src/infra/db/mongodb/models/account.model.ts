import { Document, WithId } from 'mongodb';

export enum AccountRoleMongo {
  ADMIN = 'admin',
  USER = 'user'
}

export type AccountMongo = {
  name: string;
  email: string;
  password: string;
  accessToken?: string;
  role: AccountRoleMongo;
} & WithId<Document>;
