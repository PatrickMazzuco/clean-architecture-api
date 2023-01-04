import { LoginController } from './login.controller';
import { Authentication, EmailValidator, HttpRequest } from './login.protocols';
import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import { HttpResponseFactory } from '@/presentation/helpers/http.helper';

const mockHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@email.com',
    password: 'any_password'
  }
});

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async execute(
      params: Authentication.Params
    ): Promise<Authentication.Result> {
      return {
        accessToken: 'any_token'
      };
    }
  }
  return new AuthenticationStub();
};

type SutTypes = {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();
  const sut = new LoginController(emailValidatorStub, authenticationStub);

  return {
    sut,
    emailValidatorStub,
    authenticationStub
  };
};

describe('Login Controller', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = mockHttpRequest();
    delete httpRequest.body.email;

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      HttpResponseFactory.BadRequestError(new MissingParamError('email'))
    );
  });

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = mockHttpRequest();
    delete httpRequest.body.password;

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      HttpResponseFactory.BadRequestError(new MissingParamError('password'))
    );
  });

  it('should call EmailValidator with correct value', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = mockHttpRequest();

    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid');

    await sut.handle(httpRequest);
    expect(emailValidatorSpy).toBeCalledWith(httpRequest.body.email);
  });

  it('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = mockHttpRequest();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      HttpResponseFactory.BadRequestError(new InvalidParamError('email'))
    );
  });

  it('should return 500 if EmailValidator throws an error', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = mockHttpRequest();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      HttpResponseFactory.InternalServerError(new Error())
    );
  });

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const httpRequest = mockHttpRequest();

    const authenticationSpy = jest.spyOn(authenticationStub, 'execute');

    await sut.handle(httpRequest);
    expect(authenticationSpy).toBeCalledWith({
      email: httpRequest.body.email,
      password: httpRequest.body.password
    });
  });

  it('should return 500 if Authentication throws an error', async () => {
    const { sut, authenticationStub } = makeSut();
    const httpRequest = mockHttpRequest();

    jest.spyOn(authenticationStub, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      HttpResponseFactory.InternalServerError(new Error())
    );
  });

  it('should return an access token when authentication is successfull', async () => {
    const { sut } = makeSut();
    const httpRequest = mockHttpRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      HttpResponseFactory.Ok({
        accessToken: 'any_token'
      })
    );
  });
});
