import crypto from 'node:crypto';
import { promisify } from 'node:util';

import { Encrypter } from '@/application/protocols/encrypter.service';

type Config = {
  iterations: number;
  keyLength: number;
  digest: 'sha512' | 'sha256' | 'sha1';
};

export namespace CryptoAdapter {
  export type Params = Config;
}

export class CryptoAdapter implements Encrypter {
  constructor(private readonly config: Config) {}
  async encrypt(value: Encrypter.Params): Promise<Encrypter.Result> {
    const { iterations, keyLength, digest } = this.config;

    const pbkdf2 = promisify(crypto.pbkdf2);
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = await pbkdf2(value, salt, iterations, keyLength, digest);

    return hash.toString('hex');
  }
}
