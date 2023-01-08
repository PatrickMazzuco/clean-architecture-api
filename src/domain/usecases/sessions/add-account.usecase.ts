import { Account } from '../../entities';

type Input = {
  name: string;
  email: string;
  password: string;
};

type Output = Account | null;

export namespace IAddAccount {
  export type Params = Input;
  export type Result = Output;
}

export interface IAddAccount {
  execute: (params: IAddAccount.Params) => Promise<IAddAccount.Result>;
}
