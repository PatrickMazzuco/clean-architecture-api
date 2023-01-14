import { MongoHelper } from '../helpers/mongodb.helper';
import { IAddSurveyRepository } from '@/application/protocols/db/survey/add-survey.repository';

export class SurveyMongoRepository implements IAddSurveyRepository {
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
}
