import { Authentication, Controller, EmailValidator } from './login.protocols';
import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import { HttpResponseFactory } from '@/presentation/helpers/http.helper';

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle(request: Controller.Params): Promise<Controller.Result> {
    try {
      const requiredFields = ['email', 'password'];

      for (const field of requiredFields) {
        if (!request.body[field]) {
          return HttpResponseFactory.BadRequestError(
            new MissingParamError(field)
          );
        }
      }

      const isEmailValid = this.emailValidator.isValid(request.body.email);

      if (!isEmailValid) {
        return HttpResponseFactory.BadRequestError(
          new InvalidParamError('email')
        );
      }

      const authenticationResult = await this.authentication.execute({
        email: request.body.email,
        password: request.body.password
      });

      if (!authenticationResult.accessToken) {
        return HttpResponseFactory.UnauthorizedError();
      }

      return HttpResponseFactory.Ok(authenticationResult);
    } catch (error) {
      return HttpResponseFactory.InternalServerError(error as Error);
    }
  }
}
