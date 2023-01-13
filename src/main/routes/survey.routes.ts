import { Router } from 'express';

import { ExpressMiddlewareAdapter } from '../adapters/express/express-middleware.adapter';
import { ExpressRouteAdapter } from '../adapters/express/express-route.adapter';
import { makeAddSurveyController } from '../factories/controllers/surveys/add-survey/add-survey.factory';
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware.factory';

export default (router: Router): void => {
  const adminAuthMiddleware = ExpressMiddlewareAdapter.adapt(
    makeAuthMiddleware('admin')
  );
  const addSurveyController = makeAddSurveyController();

  router.post(
    '/surveys',
    adminAuthMiddleware,
    ExpressRouteAdapter.adapt(addSurveyController)
  );
};
