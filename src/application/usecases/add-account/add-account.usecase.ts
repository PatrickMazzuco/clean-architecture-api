import {
  AddAccount,
  AddAccountRepository,
  Hasher
} from './add-account.protocols';

export class AddAccountUsecase implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async execute({
    name,
    email,
    password
  }: AddAccount.Params): Promise<AddAccount.Result> {
    const hashedPassword = await this.hasher.hash(password);

    return await this.addAccountRepository.add({
      name,
      email,
      password: hashedPassword
    });
  }
}
