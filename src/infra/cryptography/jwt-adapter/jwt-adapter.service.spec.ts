import jwt from 'jsonwebtoken';

import { JwtAdapter } from './jwt-adapter.service';
import { Encrypter } from '@/application/protocols/cryptography/encrypter.service';

const SECRET_KEY = 'secret';
const TOKEN = 'token';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('token')
}));

const mockParams = (): Encrypter.Params => {
  return { id: 'any_id' };
};

const makeSut = (): JwtAdapter => {
  return new JwtAdapter({ secret: SECRET_KEY });
};

describe('JWT Adapter', () => {
  it('should call jwt sign with correct values', async () => {
    const sut = makeSut();
    const params = mockParams();
    const jwtSignSpy = jest.spyOn(jwt, 'sign');

    await sut.encrypt(params);
    expect(jwtSignSpy).toBeCalledWith(params, SECRET_KEY);
  });

  it('should return a jwt token on sign success', async () => {
    const sut = makeSut();
    const params = mockParams();
    const token = await sut.encrypt(params);
    expect(token).toEqual(TOKEN);
  });

  it('should throw if jwt sign throws', async () => {
    const sut = makeSut();
    const params = mockParams();

    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.encrypt(params);
    await expect(promise).rejects.toThrow();
  });
});
