import { AuthenticationUseCase } from './authentication.usecase';
import { FindAccountByEmailRepository } from '@/application/protocols/find-account-by-email.repository';
import { Account } from '@/domain/entities';

describe('Authentication Usecase', () => {
  test('should call FindAccountByEmailRepository with correct email', async () => {
    class FindAccountByEmailRepositoryStub
      implements FindAccountByEmailRepository
    {
      async findByEmail(email: string): Promise<Account | null> {
        return await new Promise((resolve) =>
          resolve({
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'valid_password'
          })
        );
      }
    }

    const findAccountByEmailRepositoryStub =
      new FindAccountByEmailRepositoryStub();
    const sut = new AuthenticationUseCase(findAccountByEmailRepositoryStub);
    const authData = {
      email: 'valid_email@email.com',
      password: 'valid_password'
    };

    const findAccountSpy = jest.spyOn(
      findAccountByEmailRepositoryStub,
      'findByEmail'
    );
    await sut.execute(authData);

    expect(findAccountSpy).toHaveBeenCalledWith(authData.email);
  });
});
