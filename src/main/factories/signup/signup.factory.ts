import { LogControllerDecorator } from '../../decorators/log.decorator';
import { makeSignUpValidator } from './signup-validator.factory';
import { AddAccountUsecase } from '@/application/usecases/add-account/add-account.usecase';
import { AuthenticationUseCase } from '@/application/usecases/authentication/authentication.usecase';
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter.service';
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter.service';
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository/account.repository';
import { LogMongoRepository } from '@/infra/db/mongodb/log-repository/log.repository';
import env from '@/main/config/env';
import { SignUpController } from '@/presentation/controllers/signup/signup.controller';
import { Controller } from '@/presentation/protocols';

export const makeSignUpController = (): Controller => {
  const bcryptAdapter = new BcryptAdapter();
  const accountRepository = new AccountMongoRepository();
  const addAccount = new AddAccountUsecase(bcryptAdapter, accountRepository);
  const signUpValidator = makeSignUpValidator();
  const encrypter = new JwtAdapter({ secret: env.jwtSecret });

  const authenticationUseCase = new AuthenticationUseCase(
    accountRepository,
    bcryptAdapter,
    encrypter,
    accountRepository
  );

  const signUpController = new SignUpController(
    addAccount,
    signUpValidator,
    authenticationUseCase
  );

  const logErrorRepository = new LogMongoRepository();

  return new LogControllerDecorator(signUpController, logErrorRepository);
};
