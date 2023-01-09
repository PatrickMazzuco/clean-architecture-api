import jwt from 'jsonwebtoken';

import { IDecrypter } from '@/application/protocols/cryptography/decrypter.service';
import { IEncrypter } from '@/application/protocols/cryptography/encrypter.service';

type Constructor = {
  secret: string;
};

export namespace JwtAdapter {
  export type Config = Constructor;
}

export class JwtAdapter implements IEncrypter, IDecrypter {
  constructor(private readonly config: JwtAdapter.Config) {}

  async encrypt(params: IEncrypter.Params): Promise<IEncrypter.Result> {
    const accessToken = jwt.sign({ id: params.id }, this.config.secret);
    return accessToken;
  }

  async decrypt(params: IDecrypter.Params): Promise<IDecrypter.Result> {
    try {
      const value = jwt.verify(params, this.config.secret);
      return value as IDecrypter.Result;
    } catch (error) {
      console.log(error);
      if (error instanceof jwt.JsonWebTokenError) {
        return null;
      }

      throw error;
    }
  }
}
