import {
  IAddSurveyAnswer,
  IAddSurveyAnswerRepository
} from './add-survey-answer.protocols';

type AddSurveyAnswerConfig = {
  addSurveyAnswerRepository: IAddSurveyAnswerRepository;
};

export namespace AddSurveyAnswerUseCase {
  export type Config = AddSurveyAnswerConfig;
}

export class AddSurveyAnswerUseCase implements IAddSurveyAnswer {
  private readonly addSurveyAnswerRepository: IAddSurveyAnswerRepository;

  constructor(config: AddSurveyAnswerConfig) {
    this.addSurveyAnswerRepository = config.addSurveyAnswerRepository;
  }

  async execute(
    data: IAddSurveyAnswer.Params
  ): Promise<IAddSurveyAnswer.Result> {
    const surveyAnswerData: IAddSurveyAnswerRepository.Params = {
      accountId: data.accountId,
      surveyId: data.surveyId,
      answer: data.answer,
      date: new Date()
    };

    return await this.addSurveyAnswerRepository.add(surveyAnswerData);
  }
}
