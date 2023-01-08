import { LogMongoRepository } from '@/infra/db/mongodb/log-repository/log.repository';
import { LogControllerDecorator } from '@/main/decorators/log.decorator';
import { Controller } from '@/presentation/protocols';

export const makeLogControllerDecorator = (
  controller: Controller
): Controller => {
  const logErrorRepository = new LogMongoRepository();

  return new LogControllerDecorator(controller, logErrorRepository);
};
