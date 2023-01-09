/* eslint-disable @typescript-eslint/no-non-null-assertion */
import request from 'supertest';

import app from '../config/app';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongodb.helper';
import { SurveyMongo } from '@/infra/db/mongodb/models/survey.model';

describe('Surveys Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('surveys');
    await accountCollection.deleteMany({});
  });

  describe('POST /surveys', () => {
    it('should return 204 and create a survey on success', async () => {
      const surveyData = {
        question: 'Question',
        answers: [
          {
            answer: 'Answer 1',
            image: 'http://image-name.com'
          },
          {
            answer: 'Answer 2'
          }
        ]
      };

      await request(app).post('/api/surveys').send(surveyData).expect(204);

      const surveyCollection = MongoHelper.getCollection('surveys');
      const survey = await surveyCollection.findOne<SurveyMongo>({
        question: surveyData.question
      });

      expect(survey).toBeTruthy();
      expect(survey!.answers).toHaveLength(surveyData.answers.length);
    });
  });
});
