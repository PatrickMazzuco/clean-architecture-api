/* eslint-disable @typescript-eslint/naming-convention */
import bcrypt from 'bcrypt';

import { BcryptAdapter } from './bcrypt-adapter.service';

jest.mock('bcrypt', () => ({
  async genSalt(): Promise<string> {
    return 'any_salt';
  },
  async hash(): Promise<string> {
    return 'any_hash';
  }
}));

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter();
};

describe('Bcrypt Adapter', () => {
  it('should call bcrypt with correct value', async () => {
    const sut = makeSut();
    const valueToEncrypt = 'any_value';

    const bcryptGenSaltSpy = jest.spyOn(bcrypt, 'genSalt');
    const bcryptHashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.encrypt(valueToEncrypt);

    expect(bcryptGenSaltSpy).toBeCalledTimes(1);
    expect(bcryptHashSpy).toBeCalledWith(valueToEncrypt, 'any_salt');
  });

  it('should return the hashed password on success', async () => {
    const sut = makeSut();
    const valueToEncrypt = 'any_value';

    const hashedPassword = await sut.encrypt(valueToEncrypt);

    expect(hashedPassword).toEqual('any_hash');
    expect(hashedPassword).not.toEqual(valueToEncrypt);
  });

  it('should throw if bcrypt throws', async () => {
    const sut = makeSut();
    const valueToEncrypt = 'any_value';

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.encrypt(valueToEncrypt);

    await expect(promise).rejects.toThrow();
  });
});
