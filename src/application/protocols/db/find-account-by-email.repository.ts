import { Account } from '@/domain/entities';

type Output = Account | null;

export namespace FindAccountByEmailRepository {
  export type Result = Output;
}

export abstract class FindAccountByEmailRepository {
  abstract findByEmail(
    email: string
  ): Promise<FindAccountByEmailRepository.Result>;
}
