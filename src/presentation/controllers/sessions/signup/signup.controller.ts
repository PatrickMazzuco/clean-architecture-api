import { IAddAccount } from '../../../../domain/usecases/sessions/add-account.usecase';
import { HttpResponseFactory } from '../../../helpers/http/http.helper';
import {
  IAuthentication,
  IController,
  HttpRequest,
  HttpResponse,
  IValidator
} from './signup.protocols';

export class SignUpController implements IController {
  constructor(
    private readonly addAccount: IAddAccount,
    private readonly validator: IValidator,
    private readonly authentication: IAuthentication
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
