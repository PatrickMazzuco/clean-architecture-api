import { Express, Router } from 'express';

import sessionsRouter from '../routes/sessions.routes';
import surveyRouter from '../routes/survey.routes';

const setupRoutes = (app: Express): void => {
  const router = Router();
  app.use('/api', router);

  sessionsRouter(router);
  surveyRouter(router);
};

export default setupRoutes;
