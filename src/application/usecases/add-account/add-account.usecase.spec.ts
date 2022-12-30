import { AddAccountUsecase } from './add-account.usecase';
import { Encrypter } from '@/application/protocols/encrypter.service';
import { AddAccount } from '@/domain/usecases/add-account.usecase';

describe('AddAccount Usecase', () => {
  it('should call Encrypter with correct password', async () => {
    class EncrypterStub implements Encrypter {
      async encrypt(value: string): Promise<string> {
        return await new Promise((resolve) => resolve('hashed_password'));
      }
    }

    const encrypterStub = new EncrypterStub();
    const sut = new AddAccountUsecase(encrypterStub);
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt');

    const accountData: AddAccount.Params = {
      name: 'any_name',
      email: 'valid_email@email.com',
      password: 'any_password'
    };

    await sut.execute(accountData);
    expect(encrypterSpy).toBeCalledWith(accountData.password);
  });
});
