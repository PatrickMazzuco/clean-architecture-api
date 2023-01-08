import { Account } from '@/domain/entities';

type Output = Account | null;

export namespace IFindAccountByEmailRepository {
  export type Result = Output;
}

export interface IFindAccountByEmailRepository {
  findByEmail: (email: string) => Promise<IFindAccountByEmailRepository.Result>;
}
