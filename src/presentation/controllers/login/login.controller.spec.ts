import { LoginController } from './login.controller';
import { EmailValidator, HttpRequest } from './login.protocols';
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

type SutTypes = {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub);

  return {
    sut,
    emailValidatorStub
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
});
