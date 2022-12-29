import { MissingParamError } from '../errors/missing-param.error';
import { HttpErrorFactory } from '../helpers/http.helper';
import { HttpRequest, HttpResponse } from '../protocols/http';

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return HttpErrorFactory.BadRequest(new MissingParamError(field));
      }
    }

    return {
      statusCode: 200,
      body: 'ok'
    };
  }
}
