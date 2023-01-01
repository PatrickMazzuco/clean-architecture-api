import { AddAccountUsecase } from '@/application/usecases/add-account/add-account.usecase';
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter.service';
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository/account.repository';
import { SignUpController } from '@/presentation/controllers/signup/signup.controller';
import { EmailValidatorAdapter } from '@/utils/email-validator.adapter';

export const makeSignUpController = (): SignUpController => {
  const emailValidator = new EmailValidatorAdapter();

  const bcryptAdapter = new BcryptAdapter();
  const accountRepository = new AccountMongoRepository();
  const addAccount = new AddAccountUsecase(bcryptAdapter, accountRepository);

  return new SignUpController(emailValidator, addAccount);
};
