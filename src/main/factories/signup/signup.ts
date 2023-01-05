import { LogControllerDecorator } from '../../decorators/log.decorator';
import { makeSignUpValidator } from './signup-validator';
import { AddAccountUsecase } from '@/application/usecases/add-account/add-account.usecase';
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter.service';
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository/account.repository';
import { LogMongoRepository } from '@/infra/db/mongodb/log-repository/log.repository';
import { SignUpController } from '@/presentation/controllers/signup/signup.controller';
import { Controller } from '@/presentation/protocols';

export const makeSignUpController = (): Controller => {
  const bcryptAdapter = new BcryptAdapter();
  const accountRepository = new AccountMongoRepository();
  const addAccount = new AddAccountUsecase(bcryptAdapter, accountRepository);
  const signUpValidator = makeSignUpValidator();

  const signUpController = new SignUpController(addAccount, signUpValidator);

  const logErrorRepository = new LogMongoRepository();

  return new LogControllerDecorator(signUpController, logErrorRepository);
};
