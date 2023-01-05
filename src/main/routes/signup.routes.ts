import { Router } from 'express';

import { ExpressRouteAdapter } from '../adapters/express-route.adapter';
import { makeSignUpController } from '../factories/signup/signup';

export default (router: Router): void => {
  const controller = makeSignUpController();
  router.post('/signup', ExpressRouteAdapter.adapt(controller));
};
