import { AuthenticationUseCase } from './authentication.usecase';
import { FindAccountByEmailRepository } from '@/application/protocols/find-account-by-email.repository';
import { Account } from '@/domain/entities';
import { Authentication } from '@/domain/usecases/authentication.usecase';

const mockAccount = (): Account => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password'
});

const mockAuthData = (): Authentication.Params => {
  const { email, password } = mockAccount();

  return {
    email,
    password
  };
};

type SutTypes = {
  sut: AuthenticationUseCase;
  findAccountByEmailRepositoryStub: FindAccountByEmailRepository;
};

const makeSut = (): SutTypes => {
  class FindAccountByEmailRepositoryStub
    implements FindAccountByEmailRepository
  {
    async findByEmail(email: string): Promise<Account | null> {
      return await new Promise((resolve) => resolve(mockAccount()));
    }
  }

  const findAccountByEmailRepositoryStub =
    new FindAccountByEmailRepositoryStub();
  const sut = new AuthenticationUseCase(findAccountByEmailRepositoryStub);

  return {
    sut,
    findAccountByEmailRepositoryStub
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
});
