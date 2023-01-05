import bcrypt from 'bcrypt';

import { HashCompare } from '@/application/protocols/cryptography/hash-compare.service';
import { Hasher } from '@/application/protocols/cryptography/hasher.service';

export class BcryptAdapter implements Hasher, HashCompare {
  async hash(value: Hasher.Params): Promise<Hasher.Result> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(value, salt);

    return hash;
  }

  async compare(value: HashCompare.Params): Promise<HashCompare.Result> {
    const isValid = await bcrypt.compare(value.value, value.hash);

    return isValid;
  }
}
