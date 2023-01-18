type SurveyOption = {
  image?: string;
  option: string;
};

type Input = {
  question: string;
  options: SurveyOption[];
  date: Date;
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
