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
    const valueToHash = 'any_value';

    const bcryptGenSaltSpy = jest.spyOn(bcrypt, 'genSalt');
    const bcryptHashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.hash(valueToHash);

    expect(bcryptGenSaltSpy).toBeCalledTimes(1);
    expect(bcryptHashSpy).toBeCalledWith(valueToHash, 'any_salt');
  });

  it('should return the hashed password on success', async () => {
    const sut = makeSut();
    const valueToHash = 'any_value';

    const hashedPassword = await sut.hash(valueToHash);

    expect(hashedPassword).toEqual('any_hash');
    expect(hashedPassword).not.toEqual(valueToHash);
  });

  it('should throw if bcrypt throws', async () => {
    const sut = makeSut();
    const valueToHash = 'any_value';

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.hash(valueToHash);

    await expect(promise).rejects.toThrow();
  });
});
