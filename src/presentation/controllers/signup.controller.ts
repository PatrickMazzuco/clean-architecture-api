import { MissingParamError } from '../errors/missing-param.error';
import { HttpErrorFactory } from '../helpers/http.helper';
import { Controller } from '../protocols/controller';
import { HttpRequest, HttpResponse } from '../protocols/http';

export class SignUpController implements Controller {
  handle (request: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

    for (const field of requiredFields) {
      if (!request.body[field]) {
        return HttpErrorFactory.BadRequest(new MissingParamError(field));
      }
    }

    return {
      statusCode: 200,
      body: 'ok'
    };
  }
}
