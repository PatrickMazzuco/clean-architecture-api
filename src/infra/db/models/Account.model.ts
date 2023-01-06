import { Document, WithId } from 'mongodb';

export type AccountMongo = {
  name: string;
  email: string;
  password: string;
} & WithId<Document>;
