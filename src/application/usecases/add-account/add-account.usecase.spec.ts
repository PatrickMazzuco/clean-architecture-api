import {
  Account,
  IAddAccount,
  IAddAccountRepository,
  IHasher
} from './add-account.protocols';
import { AddAccountUsecase } from './add-account.usecase';

const makeHasher = (): IHasher => {
  class HasherStub implements IHasher {
    async hash(value: string): Promise<string> {
      return await new Promise((resolve) => resolve('hashed_password'));
    }
  }

  const hasherStub = new HasherStub();
  return hasherStub;
};

const mockAccount = (): Account => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'hashed_password'
});

const mockAccountData = (): IAddAccount.Params => {
  const { name, email } = mockAccount();

  return {
    name,
    email,
    password: 'valid_password'
  };
};

const makeAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add(
      accountData: IAddAccountRepository.Params
    ): Promise<IAddAccountRepository.Result> {
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
  hasherStub: IHasher;
  addAccountRepositoryStub: IAddAccountRepository;
};

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new AddAccountUsecase(hasherStub, addAccountRepositoryStub);

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub
  };
};

describe('AddAccount Usecase', () => {
  it('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const hasherSpy = jest.spyOn(hasherStub, 'hash');

    const accountData = mockAccountData();

    await sut.execute(accountData);
    expect(hasherSpy).toBeCalledWith(accountData.password);
  });

  it('should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error());

    const accountData = mockAccountData();

    const promise = sut.execute(accountData);
    await expect(promise).rejects.toThrow();
  });

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addAccountSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    const accountData = mockAccountData();

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
      .spyOn(addAccountRepositoryStub, 'add')
      .mockRejectedValueOnce(new Error());

    const accountData = mockAccountData();

    const promise = sut.execute(accountData);
    await expect(promise).rejects.toThrow();
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();
    const accountData = mockAccountData();

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
