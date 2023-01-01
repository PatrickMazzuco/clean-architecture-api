import request from 'supertest';

import app from '../config/app';

describe('Body Parser Middleware', () => {
  it('should parse the json body', async () => {
    app.post('/test-body-parser', (req, res) => {
      res.send(req.body);
    });

    await request(app)
      .post('/test-body-parser')
      .send({ name: 'John Doe' })
      .expect({ name: 'John Doe' });
  });
});
