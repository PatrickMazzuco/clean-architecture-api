import {
  AddAccount,
  AddAccountRepository,
  Encrypter
} from './add-account.protocols';

export class AddAccountUsecase implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async execute({
    name,
    email,
    password
  }: AddAccount.Params): Promise<AddAccount.Result> {
    const hashedPassword = await this.encrypter.encrypt(password);

    return await this.addAccountRepository.add({
      name,
      email,
      password: hashedPassword
    });
  }
}
