import {
  InternalServerError,
  InvalidParamError,
  MissingParamError
} from '../../errors';
import { SignUpController } from './signup.controller';
import { AddAccount, EmailValidator, HttpRequest } from './signup.protocols';

const mockAccount = (): AddAccount.Result => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'any_name@email.com',
  password: 'valid_password'
});

const mockHttpRequest = (): HttpRequest => {
  const account = mockAccount();
  return {
    body: {
      name: account.name,
      email: account.email,
      password: account.password,
      passwordConfirmation: account.password
    }
  };
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async execute(params: AddAccount.Params): Promise<AddAccount.Result> {
      const fakeAccount = mockAccount();

      return await new Promise((resolve) => resolve(fakeAccount));
    }
  }

  return new AddAccountStub();
};

type SutTypes = {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();

  const sut = new SignUpController(emailValidatorStub, addAccountStub);

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  };
};

describe('SignUp Controller', () => {
  it('should return status 400 if no name is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = mockHttpRequest();
    delete httpRequest.body.name;

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  it('should return status 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = mockHttpRequest();
    delete httpRequest.body.email;

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('should return status 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = mockHttpRequest();
    delete httpRequest.body.password;

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('should return status 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = mockHttpRequest();
    delete httpRequest.body.passwordConfirmation;

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    );
  });

  it('should return status 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = mockHttpRequest();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('should return status 400 if password confirmation fails', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = mockHttpRequest();
    httpRequest.body.passwordConfirmation = 'different_password';

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation')
    );
  });

  it('should call emailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = mockHttpRequest();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const httpRequest = mockHttpRequest();

    const addAccountSpy = jest.spyOn(addAccountStub, 'execute');

    await sut.handle(httpRequest);
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    });
  });

  it('should return status 500 if AddAccount throws an error', async () => {
    const { sut, addAccountStub } = makeSut();
    const httpRequest = mockHttpRequest();

    jest.spyOn(addAccountStub, 'execute').mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new InternalServerError());
  });

  it('should return status 500 if EmailValidator throws an error', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = mockHttpRequest();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new InternalServerError());
  });

  it('should return status 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = mockHttpRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: httpRequest.body.name,
        email: httpRequest.body.email,
        password: expect.any(String)
      })
    );
  });
});
