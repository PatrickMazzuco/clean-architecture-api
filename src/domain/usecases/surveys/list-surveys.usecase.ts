import { Survey } from '@/domain/entities';

type Input = void;

type Output = Survey[];

export namespace IListSurveys {
  export type Params = Input;
  export type Result = Output;
}

export interface IListSurveys {
  list: (params: IListSurveys.Params) => Promise<IListSurveys.Result>;
}
