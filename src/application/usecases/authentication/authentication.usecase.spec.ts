import {
  FindAccountByEmailRepository,
  HashCompare,
  TokenGenerator
} from './authentication.protocols';
import { AuthenticationUseCase } from './authentication.usecase';
import { Account } from '@/domain/entities';
import { Authentication } from '@/domain/usecases/authentication.usecase';

const mockAccount = (): Account => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'hashed_password'
});

const mockAuthData = (): Authentication.Params => {
  const { email } = mockAccount();

  return {
    email,
    password: 'valid_password'
  };
};

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(
      params: TokenGenerator.Params
    ): Promise<TokenGenerator.Result> {
      return await new Promise((resolve) => resolve('valid_token'));
    }
  }

  return new TokenGeneratorStub();
};

const makeHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare({
      value,
      hash
    }: HashCompare.Params): Promise<HashCompare.Result> {
      return await new Promise((resolve) => resolve(true));
    }
  }

  return new HashCompareStub();
};

const makeFindAccountByEmailRepository = (): FindAccountByEmailRepository => {
  class FindAccountByEmailRepositoryStub
    implements FindAccountByEmailRepository
  {
    async findByEmail(email: string): Promise<Account | null> {
      return await new Promise((resolve) => resolve(mockAccount()));
    }
  }

  return new FindAccountByEmailRepositoryStub();
};

type SutTypes = {
  sut: AuthenticationUseCase;
  findAccountByEmailRepositoryStub: FindAccountByEmailRepository;
  hashCompareStub: HashCompare;
  tokenGeneratorStub: TokenGenerator;
};

const makeSut = (): SutTypes => {
  const findAccountByEmailRepositoryStub = makeFindAccountByEmailRepository();
  const hashCompareStub = makeHashCompare();
  const tokenGeneratorStub = makeTokenGenerator();
  const sut = new AuthenticationUseCase(
    findAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub
  );

  return {
    sut,
    findAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub
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

  it('should call TokenGenerator with correct values', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const authData = mockAuthData();
    const { id } = mockAccount();

    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');
    await sut.execute(authData);

    expect(generateSpy).toHaveBeenCalledWith({
      id
    });
  });

  it('should throw when TokenGenerator throws an error', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const authData = mockAuthData();

    jest
      .spyOn(tokenGeneratorStub, 'generate')
      .mockRejectedValueOnce(new Error());
    const promise = sut.execute(authData);

    await expect(promise).rejects.toThrow();
  });

  it('should return accessToken on success', async () => {
    const { sut } = makeSut();
    const authData = mockAuthData();

    const result = await sut.execute(authData);

    expect(result.accessToken).toBe('valid_token');
  });
});
