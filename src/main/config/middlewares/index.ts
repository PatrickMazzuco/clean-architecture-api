import { Express } from 'express';

import { bodyparser } from './body-parser.middleware';
import contentType from './content-type.middleware';
import cors from './cors.middleware';

const setupMiddlewares = (app: Express): void => {
  app.use(bodyparser);
  app.use(contentType);
  app.use(cors);
};

export default setupMiddlewares;
