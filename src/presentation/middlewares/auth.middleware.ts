import { AccessDeniedError } from '../errors';
import { HttpResponseFactory } from '../helpers/http/http.helper';
import { HttpRequest, HttpResponse } from '../protocols';
import { IMiddleware } from '../protocols/middleware';

export class AuthMiddleware implements IMiddleware {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    return await new Promise((resolve) =>
      resolve(HttpResponseFactory.ForbiddenError(new AccessDeniedError()))
    );
  }
}
