import { LogControllerDecorator } from '../../decorators/log.decorator';
import { makeLoginValidator } from './login-validator.factory';
import { AuthenticationUseCase } from '@/application/usecases/authentication/authentication.usecase';
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter.service';
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter.service';
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository/account.repository';
import { LogMongoRepository } from '@/infra/db/mongodb/log-repository/log.repository';
import env from '@/main/config/env';
import { LoginController } from '@/presentation/controllers/login/login.controller';
import { Controller } from '@/presentation/protocols';

export const makeLoginController = (): Controller => {
  const bcryptAdapter = new BcryptAdapter();
  const accountRepository = new AccountMongoRepository();
  const encrypter = new JwtAdapter({ secret: env.jwtSecret });

  const authenticationUseCase = new AuthenticationUseCase(
    accountRepository,
    bcryptAdapter,
    encrypter,
    accountRepository
  );
  const loginValidator = makeLoginValidator();

  const loginController = new LoginController(
    authenticationUseCase,
    loginValidator
  );

  const logErrorRepository = new LogMongoRepository();

  return new LogControllerDecorator(loginController, logErrorRepository);
};
