import request from 'supertest';

import app from '../config/app';

describe('Content Type Middleware', () => {
  it('should have json as default response content type', async () => {
    app.get('/test-content-type', (req, res) => {
      res.send('');
    });

    await request(app).get('/test-content-type').expect('content-type', /json/);
  });

  it('should have xml as response content type when manually set', async () => {
    app.get('/test-content-type-xml', (req, res) => {
      res.type('xml');
      res.send('');
    });

    await request(app)
      .get('/test-content-type-xml')
      .expect('content-type', /xml/);
  });
});
