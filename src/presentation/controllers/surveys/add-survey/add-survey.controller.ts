import { IController, IValidator } from './add-survey.protocols';
import { HttpResponseFactory } from '@/presentation/helpers/http/http.helper';

export class AddSurveyController implements IController {
  constructor(private readonly validator: IValidator) {}

  async handle(request: IController.Params): Promise<IController.Result> {
    try {
      const error = await this.validator.validate(request.body);
      if (error) {
        return HttpResponseFactory.BadRequestError(error);
      }

      return HttpResponseFactory.Ok({});
    } catch (error) {
      return HttpResponseFactory.InternalServerError(error as Error);
    }
  }
}
