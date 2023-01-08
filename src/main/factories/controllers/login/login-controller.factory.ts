import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator.factory';
import { makeAuthenticationUsecase } from '../../usecases/authentication/authentication-usecase.factory';
import { makeLoginValidator } from './login-validator.factory';
import { LoginController } from '@/presentation/controllers/login/login.controller';
import { Controller } from '@/presentation/protocols';

export const makeLoginController = (): Controller => {
  const authenticationUseCase = makeAuthenticationUsecase();
  const loginValidator = makeLoginValidator();

  const controller = new LoginController(authenticationUseCase, loginValidator);

  return makeLogControllerDecorator(controller);
};
