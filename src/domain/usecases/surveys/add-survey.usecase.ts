type SurveyAnswer = {
  image?: string;
  answer: string;
};

type Input = {
  question: string;
  answers: SurveyAnswer[];
  date: Date;
};

type Output = void;

export namespace IAddSurvey {
  export type Params = Input;
  export type Result = Output;
}

export interface IAddSurvey {
  add: (params: IAddSurvey.Params) => Promise<IAddSurvey.Result>;
}
