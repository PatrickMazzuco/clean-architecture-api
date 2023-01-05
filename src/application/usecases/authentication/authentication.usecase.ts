import {
  Authentication,
  FindAccountByEmailRepository,
  HashCompare,
  TokenGenerator,
  UpdateAccessTokenRepository
} from './authentication.protocols';

export class AuthenticationUseCase implements Authentication {
  constructor(
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async execute(
    authData: Authentication.Params
  ): Promise<Authentication.Result> {
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

    const accessToken = await this.tokenGenerator.generate({
      id: existingAccount.id
    });

    await this.updateAccessTokenRepository.updateAccessToken({
      id: existingAccount.id,
      accessToken
    });

    return { accessToken };
  }
}
