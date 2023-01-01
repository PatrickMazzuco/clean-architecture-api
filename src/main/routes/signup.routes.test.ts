import request from 'supertest';

import app from '../config/app';

describe('Signup Route', () => {
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
        id: expect.any(String),
        name: accountData.name,
        email: accountData.email,
        password: expect.any(String)
      })
    );
  });
});
