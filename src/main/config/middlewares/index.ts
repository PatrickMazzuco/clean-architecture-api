import { Express } from 'express';

import { bodyparser } from './body-parser.middleware';
import cors from './cors.middleware';

const setupMiddlewares = (app: Express): void => {
  app.use(bodyparser);
  app.use(cors);
};

export default setupMiddlewares;
