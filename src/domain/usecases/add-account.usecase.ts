import { Account } from './entities';

type Input = {
  name: string;
  email: string;
  password: string;
};

type Output = Account;

export abstract class AddAccount {
  abstract execute: (params: AddAccount.Params) => AddAccount.Result;
}

export namespace AddAccount {
  export type Params = Input;
  export type Result = Output;
}
