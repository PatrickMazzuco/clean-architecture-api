import { Document, ObjectId, WithId } from 'mongodb';

export type SurveyAnswerMongo = {
  accountId: ObjectId;
  surveyId: ObjectId;
  answer: string;
  date: Date;
} & WithId<Document>;
