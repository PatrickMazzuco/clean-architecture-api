import { AddAccount } from '../../../domain/usecases/add-account.usecase';
import { HttpResponseFactory } from '../../helpers/http/http.helper';
import {
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
  Validator
} from './signup.protocols';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validator: Validator,
    private readonly authentication: Authentication
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(request.body);

      if (error) {
        return HttpResponseFactory.BadRequestError(error);
      }

      const { name, email, password } = request.body;

      await this.addAccount.execute({
        name,
        email,
        password
      });

      const authenticationResult = await this.authentication.execute({
        email,
        password
      });

      return HttpResponseFactory.Ok(authenticationResult);
    } catch (error) {
      return HttpResponseFactory.InternalServerError(error as Error);
    }
  }
}
