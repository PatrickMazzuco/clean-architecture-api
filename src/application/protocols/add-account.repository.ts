import { Account } from '@/domain/entities';

type Input = {
  name: string;
  email: string;
  password: string;
};

type Output = Account;

export namespace AddAccountRepository {
  export type Params = Input;
  export type Result = Output;
}

export abstract class AddAccountRepository {
  abstract add(
    params: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result>;
}
