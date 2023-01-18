/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Collection } from 'mongodb';

import { MongoHelper } from '../helpers/mongodb.helper';
import { SurveyAnswerMongoRepository } from './survey-answer.repository';
import { IAddSurveyAnswerRepository } from '@/application/protocols/db/survey/add-survey-answer.repository';

const makeSut = (): SurveyAnswerMongoRepository => {
  return new SurveyAnswerMongoRepository();
};

const makeSurvey = async (): Promise<string> => {
  const surveyCollection = MongoHelper.getCollection('surveys');
  const survey = await surveyCollection.insertOne({
    question: 'any_question',
    options: [
      {
        image: 'any_image',
        option: 'any_option'
      },
      {
        option: 'another_option'
      }
    ],
    date: new Date()
  });

  return survey.insertedId.toHexString();
};

const makeAccount = async (): Promise<string> => {
  const accountCollection = MongoHelper.getCollection('accounts');
  const account = await accountCollection.insertOne({
    name: 'any_name',
    email: 'valid_email@test.com',
    password: 'hashed_password'
  });

  return account.insertedId.toHexString();
};

describe('SurveyAnswer Mongo Repository', () => {
  let surveyCollection: Collection;
  let SurveyAnswerCollection: Collection;
  let accountCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys');
    SurveyAnswerCollection = MongoHelper.getCollection('surveyAnswers');
    accountCollection = MongoHelper.getCollection('accounts');

    await SurveyAnswerCollection.deleteMany({});
    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
  });

  describe('AddSurveyAnswer', () => {
    it('should be able to add a new SurveyAnswer', async () => {
      const sut = makeSut();
      const surveyId = await makeSurvey();
      const accountId = await makeAccount();
      const surveyAnswerData: IAddSurveyAnswerRepository.Params = {
        accountId,
        surveyId,
        date: new Date(),
        answer: 'any_answer'
      };

      const surveyAnswer = await sut.add(surveyAnswerData);

      expect(surveyAnswer).toBeTruthy();
      expect(surveyAnswer).toEqual(
        expect.objectContaining({
          ...surveyAnswerData,
          id: expect.any(String)
        })
      );
    });
  });
});
