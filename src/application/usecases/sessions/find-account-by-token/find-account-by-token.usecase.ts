import {
  IDecrypter,
  IFindAccountByIdRepository,
  IFindAccountByToken
} from './find-account-by-token.protocols';

export class FindAccountByTokenUseCase implements IFindAccountByToken {
  constructor(
    private readonly decrypter: IDecrypter,
    private readonly findAccountByIdRepository: IFindAccountByIdRepository
  ) {}

  async execute({
    accessToken,
    role
  }: IFindAccountByToken.Params): Promise<IFindAccountByToken.Result> {
    const tokenData = await this.decrypter.decrypt(accessToken);

    if (!tokenData) {
      return null;
    }

    const account = await this.findAccountByIdRepository.findById(tokenData.id);

    if (!account) {
      return null;
    }

    if (role && account.role !== role) {
      return null;
    }

    return account;
  }
}
