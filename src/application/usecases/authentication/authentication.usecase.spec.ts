import {
  FindAccountByEmailRepository,
  HashCompare
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
};

const makeSut = (): SutTypes => {
  const findAccountByEmailRepositoryStub = makeFindAccountByEmailRepository();
  const hashCompareStub = makeHashCompare();
  const sut = new AuthenticationUseCase(
    findAccountByEmailRepositoryStub,
    hashCompareStub
  );

  return {
    sut,
    findAccountByEmailRepositoryStub,
    hashCompareStub
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
});
