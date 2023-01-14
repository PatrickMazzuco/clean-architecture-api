import { IListSurveys, IListSurveysRepository } from './list-surveys.protocols';

type ListSurveyConfig = {
  listSurveyRepository: IListSurveysRepository;
};

export namespace ListSurveysUsecase {
  export type Config = ListSurveyConfig;
}

export class ListSurveysUsecase implements IListSurveys {
  private readonly listSurveyRepository: IListSurveysRepository;
  constructor(config: ListSurveyConfig) {
    this.listSurveyRepository = config.listSurveyRepository;
  }

  async list(): Promise<IListSurveys.Result> {
    return await this.listSurveyRepository.list();
  }
}
