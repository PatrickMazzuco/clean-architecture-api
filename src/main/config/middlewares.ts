import { Express } from 'express';

import { bodyparser, contentType, cors } from '../middlewares';

const setupMiddlewares = (app: Express): void => {
  app.use(bodyparser);
  app.use(contentType);
  app.use(cors);
};

export default setupMiddlewares;
