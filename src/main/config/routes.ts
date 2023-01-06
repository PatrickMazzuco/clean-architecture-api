import { Express, Router } from 'express';

import sessionsRouter from '../routes/sessions.routes';

const setupRoutes = (app: Express): void => {
  const router = Router();
  app.use('/api', router);

  sessionsRouter(router);
};

export default setupRoutes;
