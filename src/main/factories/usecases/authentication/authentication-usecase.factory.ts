import { AuthenticationUseCase } from '@/application/usecases/authentication/authentication.usecase';
import { IAuthentication } from '@/domain/usecases/sessions/authentication.usecase';
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter.service';
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter.service';
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository/account.repository';
import env from '@/main/config/env';

export const makeAuthenticationUsecase = (): IAuthentication => {
  const bcryptAdapter = new BcryptAdapter();
  const accountRepository = new AccountMongoRepository();
  const encrypter = new JwtAdapter({ secret: env.jwtSecret });

  const authenticationUseCase = new AuthenticationUseCase(
    accountRepository,
    bcryptAdapter,
    encrypter,
    accountRepository
  );

  return authenticationUseCase;
};
