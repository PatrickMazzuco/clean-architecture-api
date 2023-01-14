import { MongoHelper } from '../helpers/mongodb.helper';
import { SurveyMongo } from '../models/survey.model';
import { SurveyMapper } from './survey.mapper';
import { IAddSurveyRepository } from '@/application/protocols/db/survey/add-survey.repository';
import { IListSurveysRepository } from '@/application/protocols/db/survey/list-surveys.repository';

export class SurveyMongoRepository
  implements IAddSurveyRepository, IListSurveysRepository
{
  async add({
    question,
    answers,
    date
  }: IAddSurveyRepository.Params): Promise<IAddSurveyRepository.Result> {
    const collection = MongoHelper.getCollection('surveys');
    await collection.insertOne({
      question,
      answers,
      date
    });
  }

  async list(): Promise<IListSurveysRepository.Result> {
    const collection = MongoHelper.getCollection('surveys');
    const surveys = await collection.find<SurveyMongo>({}).toArray();

    return surveys.map(SurveyMapper.toEntity);
  }
}
