import { Document, WithId } from 'mongodb';

export type SurveyOptionMongo = {
  image?: string;
  option: string;
};

export type SurveyMongo = {
  question: string;
  options: SurveyOptionMongo[];
  date: Date;
} & WithId<Document>;
