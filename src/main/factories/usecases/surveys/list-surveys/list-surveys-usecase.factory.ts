import { ListSurveysUsecase } from '@/application/usecases/surveys/list-surveys/list-surveys.usecase';
import { IListSurveys } from '@/domain/usecases/surveys/list-surveys.usecase';
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-repository/survey.repository';

export const makeListSurveysUsecase = (): IListSurveys => {
  const surveyRepository = new SurveyMongoRepository();
  const listSurveysUsecase = new ListSurveysUsecase({
    listSurveyRepository: surveyRepository
  });

  return listSurveysUsecase;
};
