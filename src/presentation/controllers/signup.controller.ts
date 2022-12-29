import { InternalServerError } from '../errors/internal-server.error';
import { InvalidParamError } from '../errors/invalid-param.error';
import { MissingParamError } from '../errors/missing-param.error';
import { HttpErrorFactory } from '../helpers/http.helper';
import { Controller } from '../protocols/controller';
import { EmailValidator } from '../protocols/email-validator';
import { HttpRequest, HttpResponse } from '../protocols/http';

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  handle (request: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

      for (const field of requiredFields) {
        if (!request.body[field]) {
          return HttpErrorFactory.BadRequest(new MissingParamError(field));
        }
      }

      const isEmailValid = this.emailValidator.isValid(request.body.email);

      if (!isEmailValid) {
        return HttpErrorFactory.BadRequest(new InvalidParamError('email'));
      }

      return {
        statusCode: 200,
        body: 'ok'
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: new InternalServerError()
      };
    }
  }
}
