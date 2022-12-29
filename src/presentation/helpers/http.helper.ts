import { InternalServerError } from '../errors/internal-server.error';
import { HttpResponse } from '../protocols/http';

export class HttpErrorFactory {
  static BadRequest(error: Error): HttpResponse {
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
}
