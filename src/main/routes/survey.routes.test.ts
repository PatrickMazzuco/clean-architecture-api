/* eslint-disable @typescript-eslint/no-non-null-assertion */
import request from 'supertest';

import app from '../config/app';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongodb.helper';
import { SurveyMongo } from '@/infra/db/mongodb/models/survey.model';

const mockSurveyCreation = (): any => ({
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
});

describe('Surveys Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const surveyCollection = MongoHelper.getCollection('surveys');
    const accountCollection = MongoHelper.getCollection('accounts');
    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
  });

  describe('POST /surveys', () => {
    it('should return 403 when not sending accessToken', async () => {
      const surveyData = mockSurveyCreation();
      await request(app).post('/api/surveys').send(surveyData).expect(403);
    });

    it('should return 403 when sending a token from an invalid role', async () => {
      const accountData = {
        name: 'Valid Name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      };

      const signupResponse = await request(app)
        .post('/api/signup')
        .send(accountData)
        .expect(200);

      const surveyData = mockSurveyCreation();
      await request(app)
        .post('/api/surveys')
        .set('authorization', signupResponse.body.accessToken)
        .send(surveyData)
        .expect(403);
    });

    it('should return 204 when sending a valid accessToken', async () => {
      const accountData = {
        name: 'Valid Name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      };

      const signupResponse = await request(app)
        .post('/api/signup')
        .send(accountData)
        .expect(200);

      const accountCollection = MongoHelper.getCollection('accounts');
      await accountCollection.updateOne(
        {
          email: accountData.email
        },
        {
          $set: {
            role: 'admin'
          }
        }
      );

      const surveyData = mockSurveyCreation();
      await request(app)
        .post('/api/surveys')
        .set('authorization', signupResponse.body.accessToken)
        .send(surveyData)
        .expect(204);

      const surveyCollection = MongoHelper.getCollection('surveys');
      const survey = await surveyCollection.findOne<SurveyMongo>({
        question: surveyData.question
      });

      expect(survey).toBeTruthy();
      expect(survey!.answers).toHaveLength(surveyData.answers.length);
    });
  });
});
