import {
  IAddSurveyAnswer,
  IController,
  IFindSurveyById
} from './add-survey-answer.protocols';
import { InvalidParamError } from '@/presentation/errors';
import { HttpResponseFactory } from '@/presentation/helpers/http/http.helper';

type AddSurveyAnswerConfig = {
  addSurveyAnswer: IAddSurveyAnswer;
  findSurveyById: IFindSurveyById;
};

export class AddSurveyAnswerController implements IController {
  private readonly addSurveyAnswer: IAddSurveyAnswer;
  private readonly findSurveyById: IFindSurveyById;

  constructor(config: AddSurveyAnswerConfig) {
    this.addSurveyAnswer = config.addSurveyAnswer;
    this.findSurveyById = config.findSurveyById;
  }

  async handle(request: IController.Params): Promise<IController.Result> {
    try {
      const { answer } = request.body;
      const { surveyId } = request.params;
      const { accountId } = request;

      const survey = await this.findSurveyById.execute(surveyId);

      if (!survey) {
        return HttpResponseFactory.NotFoundError();
      }

      const isInvalidAnswer = !survey.options.some(
        (option) => option.option === answer
      );

      if (isInvalidAnswer) {
        return HttpResponseFactory.BadRequestError(
          new InvalidParamError('answer')
        );
      }

      const createdSurveyAnswer = await this.addSurveyAnswer.execute({
        surveyId,
        accountId: accountId as string,
        answer
      });

      return HttpResponseFactory.Ok(createdSurveyAnswer);
    } catch (error) {
      return HttpResponseFactory.InternalServerError(error as Error);
    }
  }
}
