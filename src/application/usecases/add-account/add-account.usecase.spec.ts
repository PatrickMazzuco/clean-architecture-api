import {
  Account,
  IAddAccount,
  IAddAccountRepository,
  IFindAccountByEmailRepository,
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

const makeFindAccountByEmailRepository = (): IFindAccountByEmailRepository => {
  class FindAccountByEmailRepositoryStub
    implements IFindAccountByEmailRepository
  {
    async findByEmail(email: string): Promise<Account | null> {
      return await new Promise((resolve) => resolve(null));
    }
  }

  return new FindAccountByEmailRepositoryStub();
};

type SutTypes = {
  sut: AddAccountUsecase;
  hasherStub: IHasher;
  addAccountRepositoryStub: IAddAccountRepository;
  findAccountByEmailRepositoryStub: IFindAccountByEmailRepository;
};

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const findAccountByEmailRepositoryStub = makeFindAccountByEmailRepository();
  const sut = new AddAccountUsecase(
    hasherStub,
    addAccountRepositoryStub,
    findAccountByEmailRepositoryStub
  );

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    findAccountByEmailRepositoryStub
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

  it('should call FindAccountByEmailRepository with correct email', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    const accountData = mockAccountData();

    const findAccountSpy = jest.spyOn(
      findAccountByEmailRepositoryStub,
      'findByEmail'
    );
    await sut.execute(accountData);

    expect(findAccountSpy).toHaveBeenCalledWith(accountData.email);
  });

  it('should throw if FindAccountByEmailRepository throws an error', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    const accountData = mockAccountData();

    jest
      .spyOn(findAccountByEmailRepositoryStub, 'findByEmail')
      .mockRejectedValueOnce(new Error());

    const promise = sut.execute(accountData);

    await expect(promise).rejects.toThrow();
  });

  it('should return null if FindAccountByEmailRepository returns an account', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    const accountData = mockAccountData();
    const account = mockAccount();

    jest
      .spyOn(findAccountByEmailRepositoryStub, 'findByEmail')
      .mockResolvedValueOnce(account);

    const response = await sut.execute(accountData);

    expect(response).toBeNull();
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
