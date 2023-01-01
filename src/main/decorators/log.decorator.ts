import { Controller } from '@/presentation/protocols';

export class LogControllerDecorator implements Controller {
  constructor(private readonly controller: Controller) {}

  async handle(httpRequest: Controller.Params): Promise<Controller.Result> {
    console.log('LogControllerDecorator: ', httpRequest);
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.statusCode === 500) {
      // log
    }
    return httpResponse;
  }
}
