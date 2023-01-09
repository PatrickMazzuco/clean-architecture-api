import { Account } from '@/domain/entities';

type Output = Account | null;

export namespace IFindAccountByIdRepository {
  export type Result = Output;
}

export interface IFindAccountByIdRepository {
  findById: (id: string) => Promise<IFindAccountByIdRepository.Result>;
}
