import {
  AccountRole,
  IFindAccountByToken
} from './find-account-by-token.protocols';
import { FindAccountByTokenUseCase } from './find-account-by-token.usecase';
import { IDecrypter } from '@/application/protocols/cryptography/decrypter.service';
import { IFindAccountByIdRepository } from '@/application/protocols/db/account/find-account-by-id.repository';

const mockData = (): IFindAccountByToken.Params => ({
  accessToken: 'any_token',
  role: AccountRole.USER
});

const mockAccount = (): IFindAccountByIdRepository.Result => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'hashed_password',
  role: AccountRole.USER
});

const makeDecrypterStub = (): IDecrypter => {
  class DecrypterStub implements IDecrypter {
    async decrypt(params: IDecrypter.Params): Promise<IDecrypter.Result> {
      return await new Promise((resolve) =>
        resolve({
          id: 'any_id'
        })
      );
    }
  }
  return new DecrypterStub();
};

const makeFindAccountByIdRepositoryStub = (): IFindAccountByIdRepository => {
  class FindAccountByIdRepositoryStub implements IFindAccountByIdRepository {
    async findById(id: string): Promise<IFindAccountByIdRepository.Result> {
      return await new Promise((resolve) => resolve(mockAccount()));
    }
  }
  return new FindAccountByIdRepositoryStub();
};

type SutTypes = {
  sut: FindAccountByTokenUseCase;
  decrypterStub: IDecrypter;
  findAccountByIdRepositoryStub: IFindAccountByIdRepository;
};

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub();
  const findAccountByIdRepositoryStub = makeFindAccountByIdRepositoryStub();
  const sut = new FindAccountByTokenUseCase(
    decrypterStub,
    findAccountByIdRepositoryStub
  );
  return {
    sut,
    decrypterStub,
    findAccountByIdRepositoryStub
  };
};

describe('FindAccountByToken Usecase', () => {
  it('should call Decrypter with correct accessToken', async () => {
    const { sut, decrypterStub } = makeSut();
    const data = mockData();

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');
    await sut.execute(data);
    expect(decryptSpy).toHaveBeenCalledWith(data.accessToken);
  });

  it('should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null);

    const result = await sut.execute(mockData());
    expect(result).toBeNull();
  });

  it('should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.execute(mockData());
    await expect(promise).rejects.toThrow();
  });

  it('should call FindAccountByIdRepository with correct id', async () => {
    const { sut, findAccountByIdRepositoryStub } = makeSut();
    const data = mockData();

    const findByIdSpy = jest.spyOn(findAccountByIdRepositoryStub, 'findById');
    await sut.execute(data);
    expect(findByIdSpy).toHaveBeenCalledWith('any_id');
  });

  it('should null if FindAccountByIdRepository returns null', async () => {
    const { sut, findAccountByIdRepositoryStub } = makeSut();
    jest
      .spyOn(findAccountByIdRepositoryStub, 'findById')
      .mockResolvedValueOnce(null);

    const result = await sut.execute(mockData());
    expect(result).toBeNull();
  });

  it("should null if roles don't match", async () => {
    const { sut, findAccountByIdRepositoryStub } = makeSut();
    const account = mockAccount();
    const data = mockData();
    data.role = AccountRole.ADMIN;

    jest
      .spyOn(findAccountByIdRepositoryStub, 'findById')
      .mockResolvedValueOnce(account);

    const result = await sut.execute(data);
    expect(result).toBeNull();
  });

  it('should throw if FindAccountByIdRepository throws', async () => {
    const { sut, findAccountByIdRepositoryStub } = makeSut();
    jest
      .spyOn(findAccountByIdRepositoryStub, 'findById')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const promise = sut.execute(mockData());
    await expect(promise).rejects.toThrow();
  });

  it('should return an account on success with role', async () => {
    const { sut } = makeSut();
    const result = await sut.execute(mockData());
    expect(result).toEqual(mockAccount());
  });

  it('should return an account on success without role', async () => {
    const { sut } = makeSut();
    const data = mockData();
    delete data.role;

    const result = await sut.execute(data);
    expect(result).toEqual(mockAccount());
  });
});
