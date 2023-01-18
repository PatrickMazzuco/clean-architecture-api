import { IFindSurveyByIdRepository } from './find-survey-by-id.protocols';
import { IFindSurveyById } from '@/domain/usecases/surveys/find-survey-by-id.usecase';

type FindSurveyByIdConfig = {
  findSurveyByIdRepository: IFindSurveyByIdRepository;
};

export namespace FindSurveyByIdUseCase {
  export type Config = FindSurveyByIdConfig;
}

export class FindSurveyByIdUseCase implements IFindSurveyById {
  private readonly findSurveyByIdRepository: IFindSurveyByIdRepository;

  constructor(config: FindSurveyByIdConfig) {
    this.findSurveyByIdRepository = config.findSurveyByIdRepository;
  }

  async execute(id: IFindSurveyById.Params): Promise<IFindSurveyById.Result> {
    const survey = await this.findSurveyByIdRepository.findById(id);
    return survey;
  }
}
