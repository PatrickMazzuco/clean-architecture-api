import { makeAddSurveyValidator } from './add-survey-validator.factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator.factory';
import { makeAddSurveyUsecase } from '@/main/factories/usecases/surveys/add-survey/authentication-usecase.factory';
import { AddSurveyController } from '@/presentation/controllers/surveys/add-survey/add-survey.controller';
import { IController } from '@/presentation/protocols';

export const makeAddSurveyController = (): IController => {
  const addSurveyValidator = makeAddSurveyValidator();
  const addSurveyUsecase = makeAddSurveyUsecase();

  const controller = new AddSurveyController(
    addSurveyValidator,
    addSurveyUsecase
  );

  return makeLogControllerDecorator(controller);
};
