/* eslint-disable @typescript-eslint/naming-convention */
import crypto from 'node:crypto';

import { CryptoAdapter } from './crypto-adapter.service';

jest.mock('node:crypto', () => ({
  randomBytes: jest.fn().mockReturnValue('any_salt'),
  pbkdf2Sync: jest.fn().mockReturnValue('any_hash')
}));

const config: CryptoAdapter.Params = {
  iterations: 10000,
  keyLength: 64,
  digest: 'sha512'
};

const makeSut = (): CryptoAdapter => {
  return new CryptoAdapter(config);
};

describe('Crypto Adapter', () => {
  it('should call node:crypto with correct value', async () => {
    const sut = makeSut();
    const valueToEncrypt = 'any_value';

    const encryptSpy = jest.spyOn(crypto, 'pbkdf2Sync');

    await sut.encrypt(valueToEncrypt);

    expect(encryptSpy).toBeCalledWith(
      valueToEncrypt,
      expect.any(String),
      config.iterations,
      config.keyLength,
      config.digest
    );
  });

  it('should return the hashed password on success', async () => {
    const sut = makeSut();
    const valueToEncrypt = 'any_value';

    const hashedPassword = await sut.encrypt(valueToEncrypt);

    expect(hashedPassword).toEqual('any_hash');
    expect(hashedPassword).not.toEqual(valueToEncrypt);
  });
});
