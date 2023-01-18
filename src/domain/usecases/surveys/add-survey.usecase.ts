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

export namespace IAddSurvey {
  export type Params = Input;
  export type Result = Output;
}

export interface IAddSurvey {
  add: (params: IAddSurvey.Params) => Promise<IAddSurvey.Result>;
}
