import { AddAccount, Encrypter } from './add-account.protocols';

export class AddAccountUsecase implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async execute(params: AddAccount.Params): Promise<AddAccount.Result> {
    const hashedPassword = await this.encrypter.encrypt(params.password);

    return await new Promise((resolve) =>
      resolve({
        id: 'any_id',
        name: params.name,
        email: params.email,
        password: hashedPassword
      })
    );
  }
}
