import bcrypt from 'bcrypt';

import { IHashCompare } from '@/application/protocols/cryptography/hash-compare.service';
import { IHasher } from '@/application/protocols/cryptography/hasher.service';

export class BcryptAdapter implements IHasher, IHashCompare {
  async hash(value: IHasher.Params): Promise<IHasher.Result> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(value, salt);

    return hash;
  }

  async compare(value: IHashCompare.Params): Promise<IHashCompare.Result> {
    const isValid = await bcrypt.compare(value.value, value.hash);

    return isValid;
  }
}
