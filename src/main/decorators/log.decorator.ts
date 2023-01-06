import { LogErrorRepository } from '@/application/protocols/db/log/log-error.repository';
import { Controller } from '@/presentation/protocols';

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  async handle(httpRequest: Controller.Params): Promise<Controller.Result> {
    console.log('LogControllerDecorator: ', httpRequest);
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack);
    }
    return httpResponse;
  }
}
