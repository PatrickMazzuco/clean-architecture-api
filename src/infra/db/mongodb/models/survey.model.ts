import { Document, WithId } from 'mongodb';

export type SurveyAnswerMongo = {
  image?: string;
  answer: string;
};

export type SurveyMongo = {
  question: string;
  answers: SurveyAnswerMongo[];
  date: Date;
} & WithId<Document>;
