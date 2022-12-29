import { HttpResponse } from '../protocols/http';

export class HttpErrorFactory {
  static BadRequest (error: Error): HttpResponse {
    return {
      statusCode: 400,
      body: error
    };
  }
}
