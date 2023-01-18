import { ObjectId } from 'mongodb';

import { MongoHelper } from '../helpers/mongodb.helper';
import { SurveyMongo } from '../models/survey.model';
import { SurveyMapper } from './survey.mapper';
import { IAddSurveyRepository } from '@/application/protocols/db/survey/add-survey.repository';
import { IFindSurveyByIdRepository } from '@/application/protocols/db/survey/find-survey-by-id.repository';
import { IListSurveysRepository } from '@/application/protocols/db/survey/list-surveys.repository';

export class SurveyMongoRepository
  implements
    IAddSurveyRepository,
    IListSurveysRepository,
    IFindSurveyByIdRepository
{
  async add({
    question,
    options,
    date
  }: IAddSurveyRepository.Params): Promise<IAddSurveyRepository.Result> {
    const collection = MongoHelper.getCollection('surveys');
    await collection.insertOne({
      question,
      options,
      date
    });
  }

  async findById(id: string): Promise<IFindSurveyByIdRepository.Result> {
    const collection = MongoHelper.getCollection('surveys');
    const survey = await collection.findOne<SurveyMongo>({
      _id: new ObjectId(id)
    });

    return survey && SurveyMapper.toEntity(survey);
  }

  async list(): Promise<IListSurveysRepository.Result> {
    const collection = MongoHelper.getCollection('surveys');
    const surveys = await collection.find<SurveyMongo>({}).toArray();

    return surveys.map(SurveyMapper.toEntity);
  }
}
