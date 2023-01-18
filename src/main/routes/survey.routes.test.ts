/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import request from 'supertest';

import app from '../config/app';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongodb.helper';
import { SurveyMongo } from '@/infra/db/mongodb/models/survey.model';

const mockSurveyCreation = (): any => ({
  question: 'Question',
  options: [
    {
      option: 'Option 1',
      image: 'http://image-name.com'
    },
    {
      option: 'Option 2'
    }
  ]
});

const makeAccessTokens = async () => {
  const adminAccountData = {
    name: 'Admin Name',
    email: 'admin_email@email.com',
    password: 'valid_password',
    passwordConfirmation: 'valid_password'
  };

  const adminSignupResponse = await request(app)
    .post('/api/signup')
    .send(adminAccountData)
    .expect(200);

  const accountCollection = MongoHelper.getCollection('accounts');
  await accountCollection.updateOne(
    {
      email: adminAccountData.email
    },
    {
      $set: {
        role: 'admin'
      }
    }
  );

  const adminAccessToken = adminSignupResponse.body.accessToken;

  const userAccountData = {
    ...adminAccountData,
    name: 'User Name',
    email: 'user_email@email.com'
  };

  const userSignupResponse = await request(app)
    .post('/api/signup')
    .send(userAccountData)
    .expect(200);

  const userAccessToken = userSignupResponse.body.accessToken;

  return {
    adminAccessToken,
    userAccessToken
  };
};

const makeAccessTokensAndUsers = async () => {
  const { adminAccessToken, userAccessToken } = await makeAccessTokens();

  const surveyData = mockSurveyCreation();
  await request(app)
    .post('/api/surveys')
    .set('authorization', adminAccessToken)
    .send(surveyData)
    .expect(204);

  const surveyCollection = MongoHelper.getCollection('surveys');
  const survey = await surveyCollection.findOne<SurveyMongo>({
    question: surveyData.question
  });

  return {
    surveyId: survey!._id.toString(),
    adminAccessToken,
    userAccessToken
  };
};

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
      const { userAccessToken } = await makeAccessTokens();

      const surveyData = mockSurveyCreation();
      await request(app)
        .post('/api/surveys')
        .set('authorization', userAccessToken)
        .send(surveyData)
        .expect(403);
    });

    it('should return 204 when sending a valid accessToken', async () => {
      const { adminAccessToken } = await makeAccessTokens();

      const surveyData = mockSurveyCreation();
      await request(app)
        .post('/api/surveys')
        .set('authorization', adminAccessToken)
        .send(surveyData)
        .expect(204);

      const surveyCollection = MongoHelper.getCollection('surveys');
      const survey = await surveyCollection.findOne<SurveyMongo>({
        question: surveyData.question
      });

      expect(survey).toBeTruthy();
      expect(survey!.options).toHaveLength(surveyData.options.length);
    });
  });

  describe('GET /surveys', () => {
    it('should return 403 when not sending accessToken', async () => {
      await request(app).get('/api/surveys').send().expect(403);
    });

    it('should return 200 on success when sending a normal user accessToken', async () => {
      const { userAccessToken, surveyId } = await makeAccessTokensAndUsers();

      const listSurveysResponse = await request(app)
        .get('/api/surveys')
        .set('authorization', userAccessToken)
        .send()
        .expect(200);

      expect(listSurveysResponse.body).toBeTruthy();
      expect(listSurveysResponse.body).toHaveLength(1);
      expect(listSurveysResponse.body[0].id).toBe(surveyId);
    });

    it('should return 200 on success when sending an admin accessToken', async () => {
      const { adminAccessToken, surveyId } = await makeAccessTokensAndUsers();

      const listSurveysResponse = await request(app)
        .get('/api/surveys')
        .set('authorization', adminAccessToken)
        .send()
        .expect(200);

      expect(listSurveysResponse.body).toBeTruthy();
      expect(listSurveysResponse.body).toHaveLength(1);
      expect(listSurveysResponse.body[0].id).toBe(surveyId);
    });
  });
});
