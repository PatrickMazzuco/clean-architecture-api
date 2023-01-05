import { Authentication, Controller, Validator } from './login.protocols';
import { HttpResponseFactory } from '@/presentation/helpers/http/http.helper';

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validator: Validator
  ) {}

  async handle(request: Controller.Params): Promise<Controller.Result> {
    try {
      const error = this.validator.validate(request.body);

      if (error) {
        return HttpResponseFactory.BadRequestError(error);
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
