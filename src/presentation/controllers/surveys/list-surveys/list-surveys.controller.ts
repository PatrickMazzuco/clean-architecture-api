import { IController, IListSurveys } from './list-surveys.protocols';
import { HttpResponseFactory } from '@/presentation/helpers/http/http.helper';

type ListSurveysConfig = {
  listSurveys: IListSurveys;
};

export namespace ListSurveysController {
  export type Config = ListSurveysConfig;
}

export class ListSurveysController implements IController {
  private readonly listSurveys: IListSurveys;
  constructor(config: ListSurveysController.Config) {
    this.listSurveys = config.listSurveys;
  }

  async handle(request: IController.Params): Promise<IController.Result> {
    await this.listSurveys.list();
    return HttpResponseFactory.NoContent();
  }
}
