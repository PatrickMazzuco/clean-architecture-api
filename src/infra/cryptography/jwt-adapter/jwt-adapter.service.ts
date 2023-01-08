import jwt from 'jsonwebtoken';

import { IEncrypter } from '@/application/protocols/cryptography/encrypter.service';

type Constructor = {
  secret: string;
};

export namespace JwtAdapter {
  export type Config = Constructor;
}

export class JwtAdapter implements IEncrypter {
  constructor(private readonly config: JwtAdapter.Config) {}

  async encrypt(params: IEncrypter.Params): Promise<IEncrypter.Result> {
    const accessToken = jwt.sign({ id: params.id }, this.config.secret);
    return accessToken;
  }
}
