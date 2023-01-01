import { LogControllerDecorator } from './log.decorator';
import { HttpResponseFactory } from '@/presentation/helpers/http.helper';
import { Controller } from '@/presentation/protocols';

type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: Controller;
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: Controller.Params): Promise<Controller.Result> {
      return HttpResponseFactory.Ok({
        name: httpRequest.body.name,
        email: httpRequest.body.email
      });
    }
  }

  return new ControllerStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const sut = new LogControllerDecorator(controllerStub);
  return {
    sut,
    controllerStub
  };
};

describe('LogController Decorator', () => {
  it('should call incoming controller handle', async () => {
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
});
