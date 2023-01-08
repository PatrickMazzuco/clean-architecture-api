import { LoginController } from './login.controller';
import { IAuthentication, HttpRequest, IValidator } from './login.protocols';
import { InvalidParamError } from '@/presentation/errors';
import { HttpResponseFactory } from '@/presentation/helpers/http/http.helper';

const mockHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@email.com',
    password: 'any_password'
  }
});

const makeValidator = (): IValidator => {
  class ValidatorStub implements IValidator {
    validate(input: any): Error | null {
      return null;
    }
  }

  return new ValidatorStub();
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
  sut: LoginController;
  authenticationStub: IAuthentication;
  validatorStub: IValidator;
};

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication();
  const validatorStub = makeValidator();

  const sut = new LoginController(authenticationStub, validatorStub);

  return {
    sut,
    authenticationStub,
    validatorStub
  };
};

describe('Login Controller', () => {
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

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    const httpRequest = mockHttpRequest();

    jest
      .spyOn(authenticationStub, 'execute')
      .mockResolvedValueOnce({ accessToken: null });

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(HttpResponseFactory.UnauthorizedError());
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
});
