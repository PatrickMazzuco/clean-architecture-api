import { Account } from '@/domain/entities';

type Input = {
  accessToken: string;
  role?: string;
};
type Output = Account | null;

export namespace IFindAccountByToken {
  export type Params = Input;
  export type Result = Output;
}

export interface IFindAccountByToken {
  execute: (
    params: IFindAccountByToken.Params
  ) => Promise<IFindAccountByToken.Result>;
}
