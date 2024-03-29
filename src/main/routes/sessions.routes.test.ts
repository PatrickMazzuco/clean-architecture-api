import request from 'supertest';

import app from '../config/app';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongodb.helper';

describe('Sessions Route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('POST /signup', () => {
    it('should return an account on success', async () => {
      const accountData = {
        name: 'Valid Name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      };

      const response = await request(app)
        .post('/api/signup')
        .send(accountData)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String)
        })
      );
    });
  });

  describe('POST /login', () => {
    it('should return 200 on successful login', async () => {
      const accountData = {
        name: 'Valid Name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      };

      await request(app).post('/api/signup').send(accountData).expect(200);

      const response = await request(app)
        .post('/api/login')
        .send({
          email: accountData.email,
          password: accountData.password
        })
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String)
        })
      );
    });

    it('should return 401 when sending wrong password', async () => {
      const accountData = {
        name: 'Valid Name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      };

      await request(app).post('/api/signup').send(accountData).expect(200);

      const response = await request(app)
        .post('/api/login')
        .send({
          email: accountData.email,
          password: 'invalid_password'
        })
        .expect(401);

      expect(response.body).toEqual({
        error: 'Unauthorized'
      });
    });

    it('should return 401 when sending wrong email', async () => {
      const accountData = {
        name: 'Valid Name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      };

      await request(app).post('/api/signup').send(accountData).expect(200);

      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'invalid_email@email.com',
          password: accountData.password
        })
        .expect(401);

      expect(response.body).toEqual({
        error: 'Unauthorized'
      });
    });
  });
});
