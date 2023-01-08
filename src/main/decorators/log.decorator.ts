import { ILogErrorRepository } from '@/application/protocols/db/log/log-error.repository';
import { IController } from '@/presentation/protocols';

export class LogControllerDecorator implements IController {
  constructor(
    private readonly controller: IController,
    private readonly logErrorRepository: ILogErrorRepository
  ) {}

  async handle(httpRequest: IController.Params): Promise<IController.Result> {
    console.log('LogControllerDecorator: ', httpRequest);
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack);
    }
    return httpResponse;
  }
}
