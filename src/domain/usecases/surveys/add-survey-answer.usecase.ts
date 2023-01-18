import { SurveyAnswer } from '@/domain/entities';

type Input = Omit<SurveyAnswer, 'id' | 'date'>;

type Output = void;

export namespace IAddSurveyAnswer {
  export type Params = Input;
  export type Result = Output;
}

export interface IAddSurveyAnswer {
  add: (params: IAddSurveyAnswer.Params) => Promise<IAddSurveyAnswer.Result>;
}
