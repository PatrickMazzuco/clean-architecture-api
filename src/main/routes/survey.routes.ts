import { Router } from 'express';

import { ExpressRouteAdapter } from '../adapters/express/express-route.adapter';
import { makeAddSurveyController } from '../factories/controllers/surveys/add-survey/add-survey.factory';
import { makeListSurveysController } from '../factories/controllers/surveys/list-surveys/list-surveys.factory';
import {
  ExpressAuthMiddlewareFactory,
  AuthRole
} from '../middlewares/express-auth.middleware';

export default (router: Router): void => {
  const addSurveyController = makeAddSurveyController();
  const listSurveysController = makeListSurveysController();

  router.post(
    '/surveys',
    ExpressAuthMiddlewareFactory.create(AuthRole.ADMIN),
    ExpressRouteAdapter.adapt(addSurveyController)
  );

  router.get(
    '/surveys',
    ExpressAuthMiddlewareFactory.create(),
    ExpressRouteAdapter.adapt(listSurveysController)
  );
};
