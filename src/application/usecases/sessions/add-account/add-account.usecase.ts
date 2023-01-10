import {
  IAddAccount,
  IAddAccountRepository,
  IFindAccountByEmailRepository,
  IHasher,
  AccountRole
} from './add-account.protocols';

export class AddAccountUsecase implements IAddAccount {
  constructor(
    private readonly hasher: IHasher,
    private readonly addAccountRepository: IAddAccountRepository,
    private readonly findAccountByEmailRepository: IFindAccountByEmailRepository
  ) {}

  async execute({
    name,
    email,
    password
  }: IAddAccount.Params): Promise<IAddAccount.Result> {
    const accountExists = await this.findAccountByEmailRepository.findByEmail(
      email
    );

    if (accountExists) {
      return null;
    }

    const hashedPassword = await this.hasher.hash(password);

    return await this.addAccountRepository.add({
      name,
      email,
      password: hashedPassword,
      role: AccountRole.USER
    });
  }
}
