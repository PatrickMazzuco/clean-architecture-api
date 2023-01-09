import { Router } from 'express';

import { ExpressRouteAdapter } from '../adapters/express/express-route.adapter';
import { makeAddSurveyController } from '../factories/controllers/surveys/add-survey/add-survey.factory';

export default (router: Router): void => {
  const addSurveyController = makeAddSurveyController();

  router.post('/surveys', ExpressRouteAdapter.adapt(addSurveyController));
};
