import { LogControllerDecorator } from '../decorators/log.decorator';
import { AddAccountUsecase } from '@/application/usecases/add-account/add-account.usecase';
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter.service';
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository/account.repository';
import { LogMongoRepository } from '@/infra/db/mongodb/log-repository/log.repository';
import { SignUpController } from '@/presentation/controllers/signup/signup.controller';
import { Controller } from '@/presentation/protocols';
import { EmailValidatorAdapter } from '@/utils/email-validator.adapter';

export const makeSignUpController = (): Controller => {
  const emailValidator = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter();
  const accountRepository = new AccountMongoRepository();
  const addAccount = new AddAccountUsecase(bcryptAdapter, accountRepository);
  const signUpController = new SignUpController(emailValidator, addAccount);

  const logErrorRepository = new LogMongoRepository();

  return new LogControllerDecorator(signUpController, logErrorRepository);
};
