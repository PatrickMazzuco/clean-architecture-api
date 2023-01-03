import { LoginController } from './login.controller';
import { MissingParamError } from '@/presentation/errors';
import { HttpResponseFactory } from '@/presentation/helpers/http.helper';

const makeSut = (): LoginController => {
  return new LoginController();
};

describe('Login Controller', () => {
  it('should return 400 if no email is provided', async () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      HttpResponseFactory.BadRequestError(new MissingParamError('email'))
    );
  });

  it('should return 400 if no password is provided', async () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@email.com'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      HttpResponseFactory.BadRequestError(new MissingParamError('password'))
    );
  });
});
