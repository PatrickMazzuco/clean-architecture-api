import { Survey } from '@/domain/entities';

type Input = void;

type Output = Survey[];

export namespace IListSurveysRepository {
  export type Params = Input;
  export type Result = Output;
}

export interface IListSurveysRepository {
  list: (
    params: IListSurveysRepository.Params
  ) => Promise<IListSurveysRepository.Result>;
}
