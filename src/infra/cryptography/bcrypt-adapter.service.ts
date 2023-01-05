import bcrypt from 'bcrypt';

import { Hasher } from '@/application/protocols/cryptography/hasher.service';

export class BcryptAdapter implements Hasher {
  async hash(value: Hasher.Params): Promise<Hasher.Result> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(value, salt);

    return hash;
  }
}
