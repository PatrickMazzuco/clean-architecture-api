import { Controller } from './login.protocols';
import { MissingParamError } from '@/presentation/errors';
import { HttpResponseFactory } from '@/presentation/helpers/http.helper';

export class LoginController implements Controller {
  async handle(request: Controller.Params): Promise<Controller.Result> {
    return await new Promise((resolve) => {
      if (!request.body.email) {
        resolve(
          HttpResponseFactory.BadRequestError(new MissingParamError('email'))
        );
      }

      if (!request.body.password) {
        resolve(
          HttpResponseFactory.BadRequestError(new MissingParamError('password'))
        );
      }
    });
  }
}
