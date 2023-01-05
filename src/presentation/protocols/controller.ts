import { HttpRequest, HttpResponse } from './http';

type Input = HttpRequest;
type Output = HttpResponse;

export namespace Controller {
  export type Params = Input;
  export type Result = Output;
}

export interface Controller {
  handle: (request: Controller.Params) => Promise<Controller.Result>;
}
