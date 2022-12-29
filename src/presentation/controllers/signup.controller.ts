import { MissingParamError } from '../errors/missing-param.error';
import { HttpErrorFactory } from '../helpers/http.helper';
import { HttpRequest, HttpResponse } from '../protocols/http';

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return HttpErrorFactory.BadRequest(new MissingParamError('name'));
    }

    if (!httpRequest.body.email) {
      return HttpErrorFactory.BadRequest(new MissingParamError('email'));
    }

    return {
      statusCode: 200,
      body: 'ok'
    };
  }
}
