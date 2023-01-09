import { AccessDeniedError } from '../errors';
import { HttpResponseFactory } from '../helpers/http/http.helper';
import { HttpRequest } from '../protocols';
import { AuthMiddleware } from './auth.middleware';

type SutTypes = {
  sut: AuthMiddleware;
};

const makeSut = (): SutTypes => {
  const sut = new AuthMiddleware();
  return {
    sut
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
});
