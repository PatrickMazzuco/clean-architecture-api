import { HttpRequest, HttpResponse } from './http';

type Input = HttpRequest;
type Output = HttpResponse;

export namespace IController {
  export type Params = Input;
  export type Result = Output;
}

export interface IController {
  handle: (request: IController.Params) => Promise<IController.Result>;
}
