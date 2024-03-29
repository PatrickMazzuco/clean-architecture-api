import {
  IFindAccountByToken,
  IMiddleware,
  HttpRequest,
  HttpResponse,
  HttpResponseFactory,
  AccessDeniedError
} from './auth-middleware.protocols';

type AuthMiddlewareConfig = {
  findAccountByToken: IFindAccountByToken;
  role?: string;
};

export namespace AuthMiddleware {
  export type Config = AuthMiddlewareConfig;
}

export class AuthMiddleware implements IMiddleware {
  private readonly findAcccountByToken: IFindAccountByToken;
  private readonly role?: string;

  constructor(config: AuthMiddleware.Config) {
    this.findAcccountByToken = config.findAccountByToken;
    this.role = config.role;
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = request.headers.authorization;

      if (!accessToken) {
        return HttpResponseFactory.ForbiddenError(new AccessDeniedError());
      }

      const account = await this.findAcccountByToken.execute({
        accessToken,
        role: this.role
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
