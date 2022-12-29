import { AddAccount } from '../../../domain/usecases/add-account.usecase';
import { InvalidParamError, MissingParamError } from '../../errors';
import { HttpResponseFactory } from '../../helpers/http.helper';
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse
} from './signup.protocols';

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  handle(request: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ];

      for (const field of requiredFields) {
        if (!request.body[field]) {
          return HttpResponseFactory.BadRequestError(
            new MissingParamError(field)
          );
        }
      }

      const { name, email, password, passwordConfirmation } = request.body;

      const isPasswordConfirmationValid = password === passwordConfirmation;
      if (!isPasswordConfirmationValid) {
        return HttpResponseFactory.BadRequestError(
          new InvalidParamError('passwordConfirmation')
        );
      }

      const isEmailValid = this.emailValidator.isValid(email);
      if (!isEmailValid) {
        return HttpResponseFactory.BadRequestError(
          new InvalidParamError('email')
        );
      }

      const account = this.addAccount.execute({
        name,
        email,
        password
      });

      return HttpResponseFactory.Ok(account);
    } catch (error) {
      return HttpResponseFactory.InternalServerError();
    }
  }
}
