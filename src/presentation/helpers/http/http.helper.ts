import { UnauthorizedError } from '../../errors';
import { InternalServerError } from '../../errors/internal-server.error';
import { HttpResponse } from '../../protocols/http';

export class HttpResponseFactory {
  static Ok(body: any): HttpResponse {
    return {
      statusCode: 200,
      body
    };
  }

  static NoContent(): HttpResponse {
    return {
      statusCode: 204,
      body: null
    };
  }

  static BadRequestError(error: Error): HttpResponse {
    return {
      statusCode: 400,
      body: error
    };
  }

  static UnauthorizedError(): HttpResponse {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    };
  }

  static ForbiddenError(error: Error): HttpResponse {
    return {
      statusCode: 403,
      body: error
    };
  }

  static InternalServerError(error: Error): HttpResponse {
    return {
      statusCode: 500,
      body: new InternalServerError(error.stack)
    };
  }
}
