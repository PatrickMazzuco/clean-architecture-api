import { SurveyAnswer } from '@/domain/entities';

type AddSurveyAnswerParams = Omit<SurveyAnswer, 'id' | 'date'>;

type AddSurveyAnswerResult = SurveyAnswer;

export namespace IAddSurveyAnswer {
  export type Params = AddSurveyAnswerParams;
  export type Result = AddSurveyAnswerResult;
}

export interface IAddSurveyAnswer {
  execute: (
    params: IAddSurveyAnswer.Params
  ) => Promise<IAddSurveyAnswer.Result>;
}
