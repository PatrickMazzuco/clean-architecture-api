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

  describe('AddSurvey', () => {
    it('should be able to add a new Survey', async () => {
      const sut = makeSut();
      const surveyData: IAddSurveyRepository.Params = {
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
      };

      await sut.add(surveyData);
      const surveyCollection = MongoHelper.getCollection('surveys');
      const survey = await surveyCollection.findOne<SurveyMongo>({
        question: surveyData.question
      });

      expect(survey).toBeTruthy();
      expect(survey!.options).toHaveLength(surveyData.options.length);
    });
  });

  describe('ListSurveys', () => {
    it('should be able to list Surveys', async () => {
      const sut = makeSut();
      const date = new Date();
      const surveyData: IAddSurveyRepository.Params = {
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
        date
      };

      const surveysBeforeInser = await sut.list();

      expect(surveysBeforeInser).toHaveLength(0);

      await sut.add(surveyData);
      const surveys = await sut.list();

      expect(surveys).toHaveLength(1);
      expect(surveys[0]).toEqual(expect.objectContaining(surveyData));
    });
  });

  describe('FindSurveyById', () => {
    it('should be able find a Survey by id', async () => {
      const sut = makeSut();
      const date = new Date();
      const surveyData: IAddSurveyRepository.Params = {
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
        date
      };

      const surveyCollection = MongoHelper.getCollection('surveys');
      const surveyInsertResult = await surveyCollection.insertOne({
        ...surveyData
      });

      const survey = await sut.findById(
        surveyInsertResult.insertedId.toString()
      );

      expect(survey).toEqual(expect.objectContaining(surveyData));
    });
  });

  it('should return null when no Survey is found', async () => {
    const sut = makeSut();
    const mockId = '5f9f1c9c9c9c9c9c9c9c9c9c';

    const survey = await sut.findById(mockId);

    expect(survey).toBeNull();
  });
});
