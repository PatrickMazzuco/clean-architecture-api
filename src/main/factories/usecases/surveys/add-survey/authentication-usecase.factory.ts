import { AddSurveyUsecase } from '@/application/usecases/surveys/add-survey/add-survey.usecase';
import { IAddSurvey } from '@/domain/usecases/surveys/add-survey.usecase';
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-repository/survey.repository';

export const makeAddSurveyUsecase = (): IAddSurvey => {
  const surveyRepository = new SurveyMongoRepository();
  const addSurveyUseCase = new AddSurveyUsecase(surveyRepository);

  return addSurveyUseCase;
};
