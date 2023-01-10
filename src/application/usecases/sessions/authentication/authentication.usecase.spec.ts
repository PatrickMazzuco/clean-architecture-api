import {
  Account,
  IAuthentication,
  IFindAccountByEmailRepository,
  IHashCompare,
  IEncrypter,
  IUpdateAccessTokenRepository,
  AccountRole
} from './authentication.protocols';
import { AuthenticationUseCase } from './authentication.usecase';

const mockAccount = (): Account => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'hashed_password',
  role: AccountRole.USER
});

const mockAuthData = (): IAuthentication.Params => {
  const { email } = mockAccount();

  return {
    email,
    password: 'valid_password'
  };
};

const mockResponse = (): IAuthentication.Result => ({
  accessToken: 'valid_token'
});

const makeUpdateAccessTokenRepository = (): IUpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub
    implements IUpdateAccessTokenRepository
  {
    async updateAccessToken(
      params: IUpdateAccessTokenRepository.Params
    ): Promise<void> {
      return await new Promise((resolve) => resolve());
    }
  }

  return new UpdateAccessTokenRepositoryStub();
};

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(params: IEncrypter.Params): Promise<IEncrypter.Result> {
      return await new Promise((resolve) =>
        resolve(mockResponse().accessToken as string)
      );
    }
  }

  return new EncrypterStub();
};

const makeHashCompare = (): IHashCompare => {
  class HashCompareStub implements IHashCompare {
    async compare({
      value,
      hash
    }: IHashCompare.Params): Promise<IHashCompare.Result> {
      return await new Promise((resolve) => resolve(true));
    }
  }

  return new HashCompareStub();
};

const makeFindAccountByEmailRepository = (): IFindAccountByEmailRepository => {
  class FindAccountByEmailRepositoryStub
    implements IFindAccountByEmailRepository
  {
    async findByEmail(email: string): Promise<Account | null> {
      return await new Promise((resolve) => resolve(mockAccount()));
    }
  }

  return new FindAccountByEmailRepositoryStub();
};

type SutTypes = {
  sut: AuthenticationUseCase;
  findAccountByEmailRepositoryStub: IFindAccountByEmailRepository;
  hashCompareStub: IHashCompare;
  encrypterStub: IEncrypter;
  updateAccessTokenRepositoryStub: IUpdateAccessTokenRepository;
};

const makeSut = (): SutTypes => {
  const findAccountByEmailRepositoryStub = makeFindAccountByEmailRepository();
  const hashCompareStub = makeHashCompare();
  const encrypterStub = makeEncrypter();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const sut = new AuthenticationUseCase(
    findAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  );

  return {
    sut,
    findAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  };
};

describe('Authentication Usecase', () => {
  it('should call FindAccountByEmailRepository with correct email', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    const authData = mockAuthData();

    const findAccountSpy = jest.spyOn(
      findAccountByEmailRepositoryStub,
      'findByEmail'
    );
    await sut.execute(authData);

    expect(findAccountSpy).toHaveBeenCalledWith(authData.email);
  });

  it('should throw if FindAccountByEmailRepository throws an error', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    const authData = mockAuthData();

    jest
      .spyOn(findAccountByEmailRepositoryStub, 'findByEmail')
      .mockRejectedValueOnce(new Error());

    const promise = sut.execute(authData);

    await expect(promise).rejects.toThrow();
  });

  it('should return accessToken as null if FindAccountByEmailRepository return null', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    const authData = mockAuthData();

    jest
      .spyOn(findAccountByEmailRepositoryStub, 'findByEmail')
      .mockResolvedValueOnce(null);

    const result = await sut.execute(authData);

    expect(result.accessToken).toBeNull();
  });

  it('should call HashCompare with correct values', async () => {
    const { sut, hashCompareStub } = makeSut();
    const authData = mockAuthData();
    const { password } = mockAccount();

    const hashCompareSpy = jest.spyOn(hashCompareStub, 'compare');
    await sut.execute(authData);

    expect(hashCompareSpy).toHaveBeenCalledWith({
      value: authData.password,
      hash: password
    });
  });

  it('should return accessToken as null if HashCompare returns false', async () => {
    const { sut, hashCompareStub } = makeSut();
    const authData = mockAuthData();

    jest.spyOn(hashCompareStub, 'compare').mockResolvedValueOnce(false);

    const result = await sut.execute(authData);

    expect(result.accessToken).toBeNull();
  });

  it('should call Encrypter with correct values', async () => {
    const { sut, encrypterStub } = makeSut();
    const authData = mockAuthData();
    const { id } = mockAccount();

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    await sut.execute(authData);

    expect(encryptSpy).toHaveBeenCalledWith({
      id
    });
  });

  it('should throw when Encrypter throws an error', async () => {
    const { sut, encrypterStub } = makeSut();
    const authData = mockAuthData();

    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error());
    const promise = sut.execute(authData);

    await expect(promise).rejects.toThrow();
  });

  it('should return accessToken on success', async () => {
    const { sut } = makeSut();
    const authData = mockAuthData();

    const result = await sut.execute(authData);

    expect(result.accessToken).toBe('valid_token');
  });

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const authData = mockAuthData();
    const { id } = mockAccount();
    const { accessToken } = mockResponse();

    const updateAccessTokenSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken'
    );
    await sut.execute(authData);

    expect(updateAccessTokenSpy).toHaveBeenCalledWith({
      id,
      accessToken
    });
  });

  it('should throw when UpdateAccessTokenRepository throws an error', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const authData = mockAuthData();

    jest
      .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockRejectedValueOnce(new Error());
    const promise = sut.execute(authData);

    await expect(promise).rejects.toThrow();
  });
});
