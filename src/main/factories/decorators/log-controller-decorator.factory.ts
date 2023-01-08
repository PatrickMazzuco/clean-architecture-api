import { LogMongoRepository } from '@/infra/db/mongodb/log-repository/log.repository';
import { LogControllerDecorator } from '@/main/decorators/log.decorator';
import { IController } from '@/presentation/protocols';

export const makeLogControllerDecorator = (
  controller: IController
): IController => {
  const logErrorRepository = new LogMongoRepository();

  return new LogControllerDecorator(controller, logErrorRepository);
};
