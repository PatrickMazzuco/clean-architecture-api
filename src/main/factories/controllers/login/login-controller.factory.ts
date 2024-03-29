import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator.factory';
import { makeAuthenticationUsecase } from '../../usecases/authentication/authentication-usecase.factory';
import { makeLoginValidator } from './login-validator.factory';
import { LoginController } from '@/presentation/controllers/sessions/login/login.controller';
import { IController } from '@/presentation/protocols';

export const makeLoginController = (): IController => {
  const authenticationUseCase = makeAuthenticationUsecase();
  const loginValidator = makeLoginValidator();

  const controller = new LoginController(authenticationUseCase, loginValidator);

  return makeLogControllerDecorator(controller);
};
