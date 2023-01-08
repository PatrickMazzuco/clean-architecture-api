import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator.factory';
import { makeAddAccountUsecase } from '../../usecases/add-account/add-account-usecase.factory';
import { makeAuthenticationUsecase } from '../../usecases/authentication/authentication-usecase.factory';
import { makeSignUpValidator } from './signup-validator.factory';
import { SignUpController } from '@/presentation/controllers/signup/signup.controller';
import { Controller } from '@/presentation/protocols';

export const makeSignUpController = (): Controller => {
  const addAccount = makeAddAccountUsecase();
  const authenticationUseCase = makeAuthenticationUsecase();
  const signUpValidator = makeSignUpValidator();

  const controller = new SignUpController(
    addAccount,
    signUpValidator,
    authenticationUseCase
  );

  return makeLogControllerDecorator(controller);
};
