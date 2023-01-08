import { AddSurveyController } from './add-survey.controller';
import { HttpRequest, IValidator } from './add-survey.protocols';
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

type SutTypes = {
  sut: AddSurveyController;
  validatorStub: IValidator;
};

const makeSut = (): SutTypes => {
  const validatorStub = makeValidator();
  const sut = new AddSurveyController(validatorStub);

  return {
    sut,
    validatorStub
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
});
