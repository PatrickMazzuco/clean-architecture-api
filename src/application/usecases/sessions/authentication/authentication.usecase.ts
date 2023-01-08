import {
  IAuthentication,
  IFindAccountByEmailRepository,
  IHashCompare,
  IEncrypter,
  IUpdateAccessTokenRepository
} from './authentication.protocols';

export class AuthenticationUseCase implements IAuthentication {
  constructor(
    private readonly findAccountByEmailRepository: IFindAccountByEmailRepository,
    private readonly hashCompare: IHashCompare,
    private readonly encrypter: IEncrypter,
    private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository
  ) {}

  async execute(
    authData: IAuthentication.Params
  ): Promise<IAuthentication.Result> {
    const existingAccount = await this.findAccountByEmailRepository.findByEmail(
      authData.email
    );

    if (!existingAccount) {
      return { accessToken: null };
    }

    const isValidPassword = await this.hashCompare.compare({
      value: authData.password,
      hash: existingAccount.password
    });

    if (!isValidPassword) {
      return { accessToken: null };
    }

    const accessToken = await this.encrypter.encrypt({
      id: existingAccount.id
    });

    await this.updateAccessTokenRepository.updateAccessToken({
      id: existingAccount.id,
      accessToken
    });

    return { accessToken };
  }
}
