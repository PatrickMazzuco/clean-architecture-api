import { HttpRequest, HttpResponse } from './http';

export abstract class Controller {
  abstract handle: (request: HttpRequest) => Promise<HttpResponse>;
}
