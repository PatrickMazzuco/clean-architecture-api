import { IAddSurvey, IAddSurveyRepository } from './add-survey.protocols';

export class AddSurveyUsecase implements IAddSurvey {
  constructor(private readonly addSurveyRepository: IAddSurveyRepository) {}

  async add({
    question,
    answers
  }: IAddSurvey.Params): Promise<IAddSurvey.Result> {
    await this.addSurveyRepository.add({
      question,
      answers
    });
  }
}
