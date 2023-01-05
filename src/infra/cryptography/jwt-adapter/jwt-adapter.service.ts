import jwt from 'jsonwebtoken';

import { Encrypter } from '@/application/protocols/cryptography/encrypter.service';

type Constructor = {
  secret: string;
};

export namespace JwtAdapter {
  export type Config = Constructor;
}

export class JwtAdapter implements Encrypter {
  constructor(private readonly config: JwtAdapter.Config) {}

  async encrypt(params: Encrypter.Params): Promise<Encrypter.Result> {
    const accessToken = jwt.sign({ id: params.id }, this.config.secret);
    return accessToken;
  }
}
