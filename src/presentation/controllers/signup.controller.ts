import { AddAccount } from '../../domain/usecases/add-account.usecase';
import { InvalidParamError, MissingParamError } from '../errors';
import { HttpErrorFactory } from '../helpers/http.helper';
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols';

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator, private readonly addAccount: AddAccount) {}

  handle (request: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

      for (const field of requiredFields) {
        if (!request.body[field]) {
          return HttpErrorFactory.BadRequest(new MissingParamError(field));
        }
      }

      const { name, email, password, passwordConfirmation } = request.body;

      const isPasswordConfirmationValid = password === passwordConfirmation;
      if (!isPasswordConfirmationValid) {
        return HttpErrorFactory.BadRequest(new InvalidParamError('passwordConfirmation'));
      }

      const isEmailValid = this.emailValidator.isValid(email);
      if (!isEmailValid) {
        return HttpErrorFactory.BadRequest(new InvalidParamError('email'));
      }

      const createdAccount = this.addAccount.execute({
        name,
        email,
        password
      });

      return {
        statusCode: 200,
        body: createdAccount
      };
    } catch (error) {
      return HttpErrorFactory.InternalServerError();
    }
  }
}
