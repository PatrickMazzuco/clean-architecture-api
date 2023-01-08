import { AddSurveyController } from './add-survey.controller';
import { HttpRequest, IValidator } from './add-survey.protocols';

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
});
