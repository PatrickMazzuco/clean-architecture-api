/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ObjectId } from 'mongodb';

import { MongoHelper } from '../helpers/mongodb.helper';
import { SurveyAnswerMongo } from '../models/survey-answer.model';
import { SurveyAnswerMapper } from './survey-answer.mapper';
import { IAddSurveyAnswerRepository } from '@/application/protocols/db/survey/add-survey-answer.repository';

export class SurveyAnswerMongoRepository implements IAddSurveyAnswerRepository {
  async add({
    accountId,
    surveyId,
    answer,
    date
  }: IAddSurveyAnswerRepository.Params): Promise<IAddSurveyAnswerRepository.Result> {
    const collection = MongoHelper.getCollection('surveys');
    const SurveyAnswerResult = await collection.insertOne({
      accountId: new ObjectId(accountId),
      surveyId: new ObjectId(surveyId),
      answer,
      date
    });

    const surveyAnswer = await collection.findOne<SurveyAnswerMongo>({
      _id: new ObjectId(SurveyAnswerResult.insertedId)
    });

    return SurveyAnswerMapper.toEntity(surveyAnswer!);
  }
}
