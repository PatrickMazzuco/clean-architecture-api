import { AddAccount } from '../../../domain/usecases/add-account.usecase';
import { InvalidParamError } from '../../errors';
import { HttpResponseFactory } from '../../helpers/http.helper';
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  Validator
} from './signup.protocols';

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validator: Validator
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(request.body);

      if (error) {
        return HttpResponseFactory.BadRequestError(error);
      }

      const { name, email, password } = request.body;

      const isEmailValid = this.emailValidator.isValid(email);
      if (!isEmailValid) {
        return HttpResponseFactory.BadRequestError(
          new InvalidParamError('email')
        );
      }

      const account = await this.addAccount.execute({
        name,
        email,
        password
      });

      return HttpResponseFactory.Ok(account);
    } catch (error) {
      return HttpResponseFactory.InternalServerError(error as Error);
    }
  }
}
