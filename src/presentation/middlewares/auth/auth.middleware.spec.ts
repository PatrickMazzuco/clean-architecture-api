/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {
  HttpRequest,
  IFindAccountByToken,
  HttpResponseFactory,
  AccessDeniedError
} from './auth-middleware.protocols';
import { AuthMiddleware } from './auth.middleware';

const mockHttpRequest = (): HttpRequest => ({
  headers: {
    Authorization: 'any_token'
  }
});

const mockAccount = (): IFindAccountByToken.Result => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'hashed_password'
});

const makeFindAccountByTokenStub = (): IFindAccountByToken => {
  class FindAccountByTokenStub implements IFindAccountByToken {
    async execute(
      params: IFindAccountByToken.Params
    ): Promise<IFindAccountByToken.Result> {
      return await new Promise((resolve) => resolve(mockAccount()));
    }
  }
  return new FindAccountByTokenStub();
};

type SutTypes = {
  sut: AuthMiddleware;
  findAccountByToken: IFindAccountByToken;
};

const makeSut = (role: string = 'role'): SutTypes => {
  const findAccountByToken = makeFindAccountByTokenStub();
  const sut = new AuthMiddleware({
    findAccountByToken,
    role
  });

  return {
    sut,
    findAccountByToken
  };
};

describe('Auth Middleware', () => {
  it('should return 403 if no Authorization header is found', async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      headers: {}
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      HttpResponseFactory.ForbiddenError(new AccessDeniedError())
    );
  });

  it('should call FindAccountByToken with correct values', async () => {
    const { sut, findAccountByToken } = makeSut();
    const httpRequest = mockHttpRequest();

    const decryptSpy = jest.spyOn(findAccountByToken, 'execute');
    await sut.handle(httpRequest);
    expect(decryptSpy).toHaveBeenCalledWith({
      accessToken: httpRequest.headers.Authorization,
      role: 'role'
    });
  });

  it('should return 403 if FindAccountByToken returns null', async () => {
    const { sut, findAccountByToken } = makeSut();
    jest.spyOn(findAccountByToken, 'execute').mockResolvedValueOnce(null);

    const httpResponse = await sut.handle(mockHttpRequest());
    expect(httpResponse).toEqual(
      HttpResponseFactory.ForbiddenError(new AccessDeniedError())
    );
  });

  it('should return 500 if FindAccountByToken throws', async () => {
    const { sut, findAccountByToken } = makeSut();
    jest.spyOn(findAccountByToken, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(mockHttpRequest());
    expect(httpResponse).toEqual(
      HttpResponseFactory.InternalServerError(new Error())
    );
  });

  it('should return 200 if FindAccountByToken returns an account', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockHttpRequest());
    const account = mockAccount();

    expect(httpResponse).toEqual(
      HttpResponseFactory.Ok({
        accountId: account!.id
      })
    );
  });
});
