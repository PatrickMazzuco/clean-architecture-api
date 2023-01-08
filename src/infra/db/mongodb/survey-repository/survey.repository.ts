import { MongoHelper } from '../helpers/mongodb.helper';
import { IAddSurveyRepository } from '@/application/protocols/db/survey/add-survey.repository';

export class SurveyMongoRepository implements IAddSurveyRepository {
  async add(
    data: IAddSurveyRepository.Params
  ): Promise<IAddSurveyRepository.Result> {
    const collection = MongoHelper.getCollection('surveys');
    await collection.insertOne(data);
  }
}
