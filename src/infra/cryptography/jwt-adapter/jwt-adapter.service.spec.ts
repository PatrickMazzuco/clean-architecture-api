import jwt from 'jsonwebtoken';

import { JwtAdapter } from './jwt-adapter.service';
import { IEncrypter } from '@/application/protocols/cryptography/encrypter.service';

const SECRET_KEY = 'secret';
const TOKEN = 'token';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('token'),
  verify: jest.fn().mockReturnValue({ id: 'any_id' })
}));

const mockTokenData = (): IEncrypter.Params => {
  return { id: 'any_id' };
};

const makeSut = (): JwtAdapter => {
  return new JwtAdapter({ secret: SECRET_KEY });
};

describe('JWT Adapter', () => {
  describe('encrypt()', () => {
    it('should call jwt sign with correct values', async () => {
      const sut = makeSut();
      const params = mockTokenData();
      const jwtSignSpy = jest.spyOn(jwt, 'sign');

      await sut.encrypt(params);
      expect(jwtSignSpy).toBeCalledWith(params, SECRET_KEY);
    });

    it('should return a jwt token on sign success', async () => {
      const sut = makeSut();
      const params = mockTokenData();
      const token = await sut.encrypt(params);
      expect(token).toEqual(TOKEN);
    });

    it('should throw if jwt sign throws', async () => {
      const sut = makeSut();
      const params = mockTokenData();

      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error();
      });

      const promise = sut.encrypt(params);
      await expect(promise).rejects.toThrow();
    });
  });

  describe('decrypt()', () => {
    it('should call jwt verify with correct values', async () => {
      const sut = makeSut();
      const jwtSignSpy = jest.spyOn(jwt, 'verify');

      await sut.decrypt(TOKEN);
      expect(jwtSignSpy).toBeCalledWith(TOKEN, SECRET_KEY);
    });

    it('should return an id on verify success', async () => {
      const sut = makeSut();
      const params = mockTokenData();
      const token = await sut.decrypt(TOKEN);
      expect(token).toEqual(params);
    });

    it('should throw if jwt verify throws', async () => {
      const sut = makeSut();

      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error();
      });

      const promise = sut.decrypt(TOKEN);
      await expect(promise).rejects.toThrow();
    });
  });
});
