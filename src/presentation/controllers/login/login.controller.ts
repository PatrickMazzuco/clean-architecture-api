import { Controller, EmailValidator } from './login.protocols';
import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import { HttpResponseFactory } from '@/presentation/helpers/http.helper';

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(request: Controller.Params): Promise<Controller.Result> {
    try {
      return await new Promise((resolve) => {
        if (!request.body.email) {
          resolve(
            HttpResponseFactory.BadRequestError(new MissingParamError('email'))
          );
        }

        if (!request.body.password) {
          resolve(
            HttpResponseFactory.BadRequestError(
              new MissingParamError('password')
            )
          );
        }

        const isEmailValid = this.emailValidator.isValid(request.body.email);

        if (!isEmailValid) {
          resolve(
            HttpResponseFactory.BadRequestError(new InvalidParamError('email'))
          );
        }

        resolve(
          HttpResponseFactory.Ok({
            message: 'Login success'
          })
        );
      });
    } catch (error) {
      return HttpResponseFactory.InternalServerError(error as Error);
    }
  }
}
