import bcrypt from 'bcrypt';

import { Encrypter } from '@/application/protocols/encrypter.service';

export class BcryptAdapter implements Encrypter {
  async encrypt(value: Encrypter.Params): Promise<Encrypter.Result> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(value, salt);

    return hash;
  }
}
