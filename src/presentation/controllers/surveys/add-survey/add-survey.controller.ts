import { IAddSurvey, IController, IValidator } from './add-survey.protocols';
import { HttpResponseFactory } from '@/presentation/helpers/http/http.helper';

export class AddSurveyController implements IController {
  constructor(
    private readonly validator: IValidator,
    private readonly addSurvey: IAddSurvey
  ) {}

  async handle(request: IController.Params): Promise<IController.Result> {
    try {
      const error = this.validator.validate(request.body);
      if (error) {
        return HttpResponseFactory.BadRequestError(error);
      }

      const { question, options } = request.body;
      await this.addSurvey.add({
        question,
        options,
        date: new Date()
      });

      return HttpResponseFactory.NoContent();
    } catch (error) {
      return HttpResponseFactory.InternalServerError(error as Error);
    }
  }
}
