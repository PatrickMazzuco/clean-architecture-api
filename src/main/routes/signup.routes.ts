import { Router } from 'express';

import { ExpressRouteAdapter } from '../adapters/express/express-route.adapter';
import { makeSignUpController } from '../factories/signup/signup.factory';

export default (router: Router): void => {
  const controller = makeSignUpController();
  router.post('/signup', ExpressRouteAdapter.adapt(controller));
};
