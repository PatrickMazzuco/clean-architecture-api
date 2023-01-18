import { SurveyAnswer } from '@/domain/entities';

type Input = Omit<SurveyAnswer, 'id'>;

type Output = SurveyAnswer;

export namespace IAddSurveyAnswerRepository {
  export type Params = Input;
  export type Result = Output;
}

export interface IAddSurveyAnswerRepository {
  add: (
    data: IAddSurveyAnswerRepository.Params
  ) => Promise<IAddSurveyAnswerRepository.Result>;
}
