import { LogControllerDecorator } from './log.decorator';
import { ILogErrorRepository } from '@/application/protocols/db/log/log-error.repository';
import { HttpResponseFactory } from '@/presentation/helpers/http/http.helper';
import { IController } from '@/presentation/protocols';

const makeLogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async logError(
      stack: ILogErrorRepository.Params
    ): Promise<ILogErrorRepository.Result> {
      await Promise.resolve();
    }
  }

  return new LogErrorRepositoryStub();
};

const makeController = (): IController => {
  class ControllerStub implements IController {
    async handle(httpRequest: IController.Params): Promise<IController.Result> {
      return HttpResponseFactory.Ok({
        name: httpRequest.body.name,
        email: httpRequest.body.email
      });
    }
  }

  return new ControllerStub();
};

type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: IController;
  logErrorRepository: ILogErrorRepository;
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepository = makeLogErrorRepository();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepository);
  return {
    sut,
    controllerStub,
    logErrorRepository
  };
};

describe('LogController Decorator', () => {
  it('should call incoming controller handle with correct values', async () => {
    const { sut, controllerStub } = makeSut();
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@email.com'
      }
    };

    const controllerStubSpy = jest.spyOn(controllerStub, 'handle');
    await sut.handle(httpRequest);

    expect(controllerStubSpy).toBeCalledWith(httpRequest);
  });

  it('should return the correct result from the incoming controller', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@email.com'
      }
    };

    const result = await sut.handle(httpRequest);

    expect(result).toEqual({
      statusCode: 200,
      body: {
        name: httpRequest.body.name,
        email: httpRequest.body.email
      }
    });
  });

  it('should call LogErrorRepository with correct errror if controller returns internal server error', async () => {
    const { sut, controllerStub, logErrorRepository } = makeSut();

    const error = new Error();
    error.stack = 'any_stack';
    const errorResponse = HttpResponseFactory.InternalServerError(error);
    const logSpy = jest.spyOn(logErrorRepository, 'logError');

    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(errorResponse);

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@email.com'
      }
    };

    await sut.handle(httpRequest);

    expect(logSpy).toBeCalledWith(error.stack);
  });
});
