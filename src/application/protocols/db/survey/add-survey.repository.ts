type SurveyAnswer = {
  image?: string;
  answer: string;
};

type Input = {
  question: string;
  answers: SurveyAnswer[];
};

type Output = void;

export namespace IAddSurveyRepository {
  export type Params = Input;
  export type Result = Output;
}

export interface IAddSurveyRepository {
  add: (
    params: IAddSurveyRepository.Params
  ) => Promise<IAddSurveyRepository.Result>;
}
