import { Router } from 'express';

import { ExpressMiddlewareAdapter } from '../adapters/express/express-middleware.adapter';
import { ExpressRouteAdapter } from '../adapters/express/express-route.adapter';
import { makeAddSurveyController } from '../factories/controllers/surveys/add-survey/add-survey.factory';
import { makeListSurveysController } from '../factories/controllers/surveys/list-surveys/list-surveys.factory';
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware.factory';

export default (router: Router): void => {
  const adminAuthMiddleware = ExpressMiddlewareAdapter.adapt(
    makeAuthMiddleware('admin')
  );
  const authMiddleware = ExpressMiddlewareAdapter.adapt(makeAuthMiddleware());

  const addSurveyController = makeAddSurveyController();
  const listSurveysController = makeListSurveysController();

  router.post(
    '/surveys',
    adminAuthMiddleware,
    ExpressRouteAdapter.adapt(addSurveyController)
  );

  router.get(
    '/surveys',
    authMiddleware,
    ExpressRouteAdapter.adapt(listSurveysController)
  );
};
