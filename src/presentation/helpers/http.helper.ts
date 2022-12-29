import { InternalServerError } from '../errors/internal-server.error';
import { HttpResponse } from '../protocols/http';

export class HttpResponseFactory {
  static BadRequestError(error: Error): HttpResponse {
    return {
      statusCode: 400,
      body: error
    };
  }

  static InternalServerError(): HttpResponse {
    return {
      statusCode: 500,
      body: new InternalServerError()
    };
  }

  static Ok(body: any): HttpResponse {
    return {
      statusCode: 200,
      body
    };
  }
}
