import { Account } from '../entities';

type Input = {
  name: string;
  email: string;
  password: string;
};

type Output = Account;

export namespace AddAccount {
  export type Params = Input;
  export type Result = Output;
}

export interface AddAccount {
  execute: (params: AddAccount.Params) => Promise<AddAccount.Result>;
}
