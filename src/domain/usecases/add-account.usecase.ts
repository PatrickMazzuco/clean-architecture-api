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

export abstract class AddAccount {
  abstract execute: (params: AddAccount.Params) => Promise<AddAccount.Result>;
}
