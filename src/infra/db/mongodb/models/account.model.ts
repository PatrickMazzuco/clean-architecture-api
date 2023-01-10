import { Document, WithId } from 'mongodb';

export const AccountRoleMongo = {
  ADMIN: 'admin',
  USER: 'user'
} as const;

export type AccountRoleMongo =
  typeof AccountRoleMongo[keyof typeof AccountRoleMongo];

export type AccountMongo = {
  name: string;
  email: string;
  password: string;
  accessToken?: string;
  role: AccountRoleMongo;
} & WithId<Document>;
