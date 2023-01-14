import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator.factory';
import { makeListSurveysUsecase } from '@/main/factories/usecases/surveys/list-surveys/list-surveys-usecase.factory';
import { ListSurveysController } from '@/presentation/controllers/surveys/list-surveys/list-surveys.controller';
import { IController } from '@/presentation/protocols';

export const makeListSurveysController = (): IController => {
  const listSurveysUsecase = makeListSurveysUsecase();

  const controller = new ListSurveysController({
    listSurveys: listSurveysUsecase
  });

  return makeLogControllerDecorator(controller);
};
