export type SurveyAnswer = {
  id: string;
  image?: string;
  answer: string;
};

export type Survey = {
  id: string;
  question: string;
  answers: SurveyAnswer[];
  date: Date;
};
