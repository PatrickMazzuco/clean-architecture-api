import { Survey } from '@/domain/entities';

type Input = string;
type Output = Survey | null;

export namespace IFindSurveyById {
  export type Params = Input;
  export type Result = Output;
}

export interface IFindSurveyById {
  execute: (id: IFindSurveyById.Params) => Promise<IFindSurveyById.Result>;
}
