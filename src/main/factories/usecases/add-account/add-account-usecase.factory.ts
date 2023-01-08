import { AddAccountUsecase } from '@/application/usecases/add-account/add-account.usecase';
import { IAddAccount } from '@/domain/usecases/add-account.usecase';
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter.service';
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository/account.repository';

export const makeAddAccountUsecase = (): IAddAccount => {
  const bcryptAdapter = new BcryptAdapter();
  const accountRepository = new AccountMongoRepository();
  const addAccount = new AddAccountUsecase(
    bcryptAdapter,
    accountRepository,
    accountRepository
  );

  return addAccount;
};
