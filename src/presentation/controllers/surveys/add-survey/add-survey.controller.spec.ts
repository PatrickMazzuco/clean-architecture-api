import { AddSurveyController } from './add-survey.controller';
import { HttpRequest, IAddSurvey, IValidator } from './add-survey.protocols';
import { InvalidParamError } from '@/presentation/errors';
import { HttpResponseFactory } from '@/presentation/helpers/http/http.helper';

const mockHttpRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ]
  }
});

const makeValidator = (): IValidator => {
  class ValidatorStub implements IValidator {
    validate(input: any): Error | null {
      return null;
    }
  }

  return new ValidatorStub();
};

const makeAddSurvey = (): IAddSurvey => {
  class AddSurveyStub implements IAddSurvey {
    async add(params: IAddSurvey.Params): Promise<IAddSurvey.Result> {}
  }

  return new AddSurveyStub();
};

type SutTypes = {
  sut: AddSurveyController;
  validatorStub: IValidator;
  addSurveyStub: IAddSurvey;
};

const makeSut = (): SutTypes => {
  const validatorStub = makeValidator();
  const addSurveyStub = makeAddSurvey();
  const sut = new AddSurveyController(validatorStub, addSurveyStub);

  return {
    sut,
    validatorStub,
    addSurveyStub
  };
};

describe('AddSurvey Controller', () => {
  it('should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut();
    const httpRequest = mockHttpRequest();

    const validatorSpy = jest.spyOn(validatorStub, 'validate');
    await sut.handle(httpRequest);

    expect(validatorSpy).toBeCalledWith(httpRequest.body);
  });

  it('should return 400 if Validator fails', async () => {
    const { sut, validatorStub } = makeSut();
    const httpRequest = mockHttpRequest();
    const invalidFieldName = 'any_field';

    jest
      .spyOn(validatorStub, 'validate')
      .mockReturnValueOnce(new InvalidParamError(invalidFieldName));
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      HttpResponseFactory.BadRequestError(
        new InvalidParamError(invalidFieldName)
      )
    );
  });

  it('should return 500 if Validator throws', async () => {
    const { sut, validatorStub } = makeSut();
    const httpRequest = mockHttpRequest();

    jest.spyOn(validatorStub, 'validate').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      HttpResponseFactory.InternalServerError(new Error())
    );
  });

  it('should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut();
    const httpRequest = mockHttpRequest();

    const validatorSpy = jest.spyOn(addSurveyStub, 'add');
    await sut.handle(httpRequest);

    expect(validatorSpy).toBeCalledWith(httpRequest.body);
  });

  it('should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut();
    const httpRequest = mockHttpRequest();

    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      HttpResponseFactory.InternalServerError(new Error())
    );
  });

  it('should return 204 if successfull', async () => {
    const { sut } = makeSut();
    const httpRequest = mockHttpRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(HttpResponseFactory.NoContent());
  });
});
