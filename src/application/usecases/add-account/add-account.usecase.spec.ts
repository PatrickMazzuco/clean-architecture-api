import {
  AddAccount,
  AddAccountRepository,
  Encrypter
} from './add-account.protocols';
import { AddAccountUsecase } from './add-account.usecase';

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return await new Promise((resolve) => resolve('hashed_password'));
    }
  }

  const encrypterStub = new EncrypterStub();
  return encrypterStub;
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async execute(
      accountData: AddAccountRepository.Params
    ): Promise<AddAccountRepository.Result> {
      const fakeAccount = {
        id: 'any_id',
        name: accountData.name,
        email: accountData.email,
        password: 'hashed_password'
      };

      return await new Promise((resolve) => resolve(fakeAccount));
    }
  }

  const addAccountRepositoryStub = new AddAccountRepositoryStub();
  return addAccountRepositoryStub;
};

type SutTypes = {
  sut: AddAccountUsecase;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new AddAccountUsecase(encrypterStub, addAccountRepositoryStub);

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  };
};

describe('AddAccount Usecase', () => {
  it('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt');

    const accountData: AddAccount.Params = {
      name: 'any_name',
      email: 'valid_email@email.com',
      password: 'any_password'
    };

    await sut.execute(accountData);
    expect(encrypterSpy).toBeCalledWith(accountData.password);
  });

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error());

    const accountData: AddAccount.Params = {
      name: 'any_name',
      email: 'valid_email@email.com',
      password: 'any_password'
    };

    const promise = sut.execute(accountData);
    await expect(promise).rejects.toThrow();
  });

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addAccountSpy = jest.spyOn(addAccountRepositoryStub, 'execute');

    const accountData: AddAccount.Params = {
      name: 'any_name',
      email: 'valid_email@email.com',
      password: 'any_password'
    };

    await sut.execute(accountData);
    expect(addAccountSpy).toBeCalledWith({
      name: accountData.name,
      email: accountData.email,
      password: 'hashed_password'
    });
  });

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, 'execute')
      .mockRejectedValueOnce(new Error());

    const accountData: AddAccount.Params = {
      name: 'any_name',
      email: 'valid_email@email.com',
      password: 'any_password'
    };

    const promise = sut.execute(accountData);
    await expect(promise).rejects.toThrow();
  });

  it('should return and account os success', async () => {
    const { sut } = makeSut();
    const accountData: AddAccount.Params = {
      name: 'any_name',
      email: 'valid_email@email.com',
      password: 'any_password'
    };

    const account = await sut.execute(accountData);

    expect(account).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: accountData.name,
        email: accountData.email,
        password: 'hashed_password'
      })
    );
  });
});
