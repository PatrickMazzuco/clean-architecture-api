import { Account } from '@/domain/entities';

type Input = {
  name: string;
  email: string;
  password: string;
};

type Output = Account;

export namespace IAddAccountRepository {
  export type Params = Input;
  export type Result = Output;
}

export interface IAddAccountRepository {
  add: (
    params: IAddAccountRepository.Params
  ) => Promise<IAddAccountRepository.Result>;
}
