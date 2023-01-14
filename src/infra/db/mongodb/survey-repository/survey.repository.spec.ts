/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MongoHelper } from '../helpers/mongodb.helper';
import { SurveyMongo } from '../models/survey.model';
import { SurveyMongoRepository } from './survey.repository';
import { IAddSurveyRepository } from '@/application/protocols/db/survey/add-survey.repository';

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
  });

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository();
  };

  it('should be able to add a new Survey', async () => {
    const sut = makeSut();
    const surveyData: IAddSurveyRepository.Params = {
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        },
        {
          answer: 'another_answer'
        }
      ],
      date: new Date()
    };

    await sut.add(surveyData);
    const surveyCollection = MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne<SurveyMongo>({
      question: surveyData.question
    });

    expect(survey).toBeTruthy();
    expect(survey!.answers).toHaveLength(surveyData.answers.length);
  });
});
