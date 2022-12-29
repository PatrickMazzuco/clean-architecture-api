import { InvalidParamError, MissingParamError } from '../errors';
import { HttpErrorFactory } from '../helpers/http.helper';
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols';

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

      const isPasswordConfirmationValid = request.body.password === request.body.passwordConfirmation;
      if (!isPasswordConfirmationValid) {
        return HttpErrorFactory.BadRequest(new InvalidParamError('passwordConfirmation'));
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
      return HttpErrorFactory.InternalServerError();
    }
  }
}
