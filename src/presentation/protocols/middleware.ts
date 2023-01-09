import { HttpRequest, HttpResponse } from './http';

type Input = HttpRequest;
type Output = HttpResponse;

export namespace IMiddleware {
  export type Params = Input;
  export type Result = Output;
}

export interface IMiddleware {
  handle: (request: IMiddleware.Params) => Promise<IMiddleware.Result>;
}
