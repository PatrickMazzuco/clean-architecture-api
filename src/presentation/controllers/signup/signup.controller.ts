import { AddAccount } from '../../../domain/usecases/add-account.usecase';
import { HttpResponseFactory } from '../../helpers/http.helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validator
} from './signup.protocols';

export class SignUpController implements Controller {
  constructor(
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
