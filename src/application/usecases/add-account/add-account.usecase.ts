import {
  IAddAccount,
  IAddAccountRepository,
  IHasher
} from './add-account.protocols';

export class AddAccountUsecase implements IAddAccount {
  constructor(
    private readonly hasher: IHasher,
    private readonly addAccountRepository: IAddAccountRepository
  ) {}

  async execute({
    name,
    email,
    password
  }: IAddAccount.Params): Promise<IAddAccount.Result> {
    const hashedPassword = await this.hasher.hash(password);

    return await this.addAccountRepository.add({
      name,
      email,
      password: hashedPassword
    });
  }
}
