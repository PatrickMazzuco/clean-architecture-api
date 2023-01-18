export type SurveyOption = {
  image?: string;
  option: string;
};

export type Survey = {
  id: string;
  question: string;
  options: SurveyOption[];
  date: Date;
};
