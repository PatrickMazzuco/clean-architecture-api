/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Collection, MongoClient } from 'mongodb';

export type MongoHelperType = {
  client: MongoClient | null;
  connect: (uri: string) => Promise<void>;
  disconnect: () => Promise<void>;
  getCollection: (name: string) => Collection;
};

export const MongoHelper: MongoHelperType = {
  client: null,

  connect: async (uri: string): Promise<void> => {
    if (!MongoHelper.client) {
      MongoHelper.client = new MongoClient(uri);
    }
    await MongoHelper.client.connect();
  },

  disconnect: async (): Promise<void> => {
    if (MongoHelper.client) {
      await MongoHelper.client.close();
      MongoHelper.client = null;
    }
  },

  getCollection: (name: string): Collection => {
    return MongoHelper.client!.db().collection(name);
  }
};
