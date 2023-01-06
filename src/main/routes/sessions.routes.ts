import { Router } from 'express';

import { ExpressRouteAdapter } from '../adapters/express/express-route.adapter';
import { makeLoginController } from '../factories/login/login.factory';
import { makeSignUpController } from '../factories/signup/signup.factory';

export default (router: Router): void => {
  const signupController = makeSignUpController();
  const loginController = makeLoginController();

  router.post('/signup', ExpressRouteAdapter.adapt(signupController));
  router.post('/login', ExpressRouteAdapter.adapt(loginController));
};
