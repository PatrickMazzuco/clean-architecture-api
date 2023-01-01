import { Express } from 'express';

import { bodyparser } from './body-parser.middleware';

const setupMiddlewares = (app: Express): void => {
  app.use(bodyparser);
};

export default setupMiddlewares;
