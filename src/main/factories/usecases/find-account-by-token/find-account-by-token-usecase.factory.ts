import { FindAccountByTokenUseCase } from '@/application/usecases/sessions/find-account-by-token/find-account-by-token.usecase';
import { IFindAccountByToken } from '@/domain/usecases/sessions/find-account-by-token.usecase';
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter.service';
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository/account.repository';
import env from '@/main/config/env';

export const makeFindAccountByTokenUseCase = (): IFindAccountByToken => {
  const accountRepository = new AccountMongoRepository();
  const decrypter = new JwtAdapter({ secret: env.jwtSecret });
  const findAccountByTokenUseCase = new FindAccountByTokenUseCase(
    decrypter,
    accountRepository
  );

  return findAccountByTokenUseCase;
};
