import { Document, WithId } from 'mongodb';

export type SurveyAnswerMongo = {
  image?: string;
  answer: string;
} & WithId<Document>;

export type SurveyMongo = {
  question: string;
  answers: SurveyAnswerMongo[];
} & WithId<Document>;
