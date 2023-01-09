import { AccessDeniedError } from '../errors';
import { HttpResponseFactory } from '../helpers/http/http.helper';
import { HttpRequest, HttpResponse } from '../protocols';
import { IMiddleware } from '../protocols/middleware';
import { IFindAccountByToken } from '@/domain/usecases/sessions/find-account-by-token.usecase';

export class AuthMiddleware implements IMiddleware {
  constructor(private readonly findAcccountByToken: IFindAccountByToken) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = request.headers.Authorization;

      if (!accessToken) {
        return HttpResponseFactory.ForbiddenError(new AccessDeniedError());
      }

      const account = await this.findAcccountByToken.execute({
        accessToken
      });

      if (!account) {
        return HttpResponseFactory.ForbiddenError(new AccessDeniedError());
      }

      return HttpResponseFactory.Ok({
        accountId: account.id
      });
    } catch (error) {
      return HttpResponseFactory.InternalServerError(error as Error);
    }
  }
}
