import { InternalServerError, InvalidParamError } from '../../errors';
import { SignUpController } from './signup.controller';
import {
  IAddAccount,
  IAuthentication,
  HttpRequest,
  IValidator
} from './signup.protocols';
import { HttpResponseFactory } from '@/presentation/helpers/http/http.helper';

const mockAccount = (): IAddAccount.Result => ({
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

const makeValidator = (): IValidator => {
  class ValidatorStub implements IValidator {
    validate(input: any): Error | null {
      return null;
    }
  }

  return new ValidatorStub();
};

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async execute(params: IAddAccount.Params): Promise<IAddAccount.Result> {
      const fakeAccount = mockAccount();

      return await new Promise((resolve) => resolve(fakeAccount));
    }
  }

  return new AddAccountStub();
};

const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async execute(
      params: IAuthentication.Params
    ): Promise<IAuthentication.Result> {
      return {
        accessToken: 'any_token'
      };
    }
  }
  return new AuthenticationStub();
};

type SutTypes = {
  sut: SignUpController;
  addAccountStub: IAddAccount;
  validatorStub: IValidator;
  authenticationStub: IAuthentication;
};

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const validatorStub = makeValidator();
  const authenticationStub = makeAuthentication();

  const sut = new SignUpController(
    addAccountStub,
    validatorStub,
    authenticationStub
  );

  return {
    sut,
    addAccountStub,
    validatorStub,
    authenticationStub
  };
};

describe('SignUp Controller', () => {
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

  it('should return status 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = mockHttpRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String)
      })
    );
  });

  it('should call Validator with correct email', async () => {
    const { sut, validatorStub } = makeSut();
    const httpRequest = mockHttpRequest();

    const validateSpy = jest.spyOn(validatorStub, 'validate');

    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return status 400 if Validator returns an error', async () => {
    const { sut, validatorStub } = makeSut();
    const httpRequest = mockHttpRequest();

    jest
      .spyOn(validatorStub, 'validate')
      .mockReturnValueOnce(new InvalidParamError('any_field'));

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      HttpResponseFactory.BadRequestError(new InvalidParamError('any_field'))
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
});
