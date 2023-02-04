/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AddSurveyAnswerController } from './add-survey-answer.controller';
import {
  HttpRequest,
  IAddSurveyAnswer,
  IFindSurveyById
} from './add-survey-answer.protocols';
import { InvalidParamError } from '@/presentation/errors';
import { HttpResponseFactory } from '@/presentation/helpers/http/http.helper';

const mockHttpRequest = (): HttpRequest => ({
  body: {
    answer: 'valid_option'
  },
  params: {
    surveyId: 'valid_survey_id'
  },
  accountId: 'any_account_id'
});

const mockSurveyAnswer = (): IAddSurveyAnswer.Result => ({
  id: 'any_id',
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'valid_option',
  date: new Date()
});

const mockSurvey = (): IFindSurveyById.Result => ({
  id: 'valid_survey_id',
  question: 'valid_question',
  options: [
    {
      image: 'valid_image',
      option: 'valid_option'
    },
    {
      option: 'valid_option2'
    }
  ],
  date: new Date()
});

const makeAddSurveyAnswer = (): IAddSurveyAnswer => {
  class AddSurveyAnswerStub implements IAddSurveyAnswer {
    async execute(
      params: IAddSurveyAnswer.Params
    ): Promise<IAddSurveyAnswer.Result> {
      return mockSurveyAnswer();
    }
  }

  return new AddSurveyAnswerStub();
};

const makeFindSurveyById = (): IFindSurveyById => {
  class FindSurveyByIdStub implements IFindSurveyById {
    async execute(
      params: IFindSurveyById.Params
    ): Promise<IFindSurveyById.Result> {
      return mockSurvey();
    }
  }

  return new FindSurveyByIdStub();
};

type SutTypes = {
  sut: AddSurveyAnswerController;
  addSurveyAnswerStub: IAddSurveyAnswer;
  findSurveyById: IFindSurveyById;
};

const makeSut = (): SutTypes => {
  const addSurveyAnswerStub = makeAddSurveyAnswer();
  const findSurveyById = makeFindSurveyById();
  const sut = new AddSurveyAnswerController({
    addSurveyAnswer: addSurveyAnswerStub,
    findSurveyById
  });

  return {
    sut,
    addSurveyAnswerStub,
    findSurveyById
  };
};

describe('AddSurveyAnswerAnswer Controller', () => {
  // it('should call Validator with correct values', async () => {
  //   const { sut, validatorStub } = makeSut();
  //   const httpRequest = mockHttpRequest();

  //   const validatorSpy = jest.spyOn(validatorStub, 'validate');
  //   await sut.handle(httpRequest);

  //   expect(validatorSpy).toBeCalledWith(httpRequest.body);
  // });

  it('should call FindSurveyById with correct value', async () => {
    const { sut, findSurveyById } = makeSut();
    const httpRequest = mockHttpRequest();

    const findSurveySpy = jest.spyOn(findSurveyById, 'execute');

    await sut.handle(httpRequest);

    expect(findSurveySpy).toBeCalledWith(httpRequest.params.surveyId);
  });

  it('should return 404 if FindSurveyById returns null', async () => {
    const { sut, findSurveyById } = makeSut();
    const httpRequest = mockHttpRequest();

    jest.spyOn(findSurveyById, 'execute').mockResolvedValueOnce(null);

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(HttpResponseFactory.NotFoundError());
  });

  it('should return 500 if FindSurveyById throws', async () => {
    const { sut, findSurveyById } = makeSut();
    const httpRequest = mockHttpRequest();

    jest.spyOn(findSurveyById, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      HttpResponseFactory.InternalServerError(new Error())
    );
  });

  it('should return 400 if answer is invalid', async () => {
    const { sut, findSurveyById } = makeSut();
    const httpRequest = mockHttpRequest();

    jest.spyOn(findSurveyById, 'execute').mockResolvedValueOnce({
      ...mockSurvey()!,
      options: [{ option: 'invalid_option' }]
    });

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      HttpResponseFactory.BadRequestError(new InvalidParamError('answer'))
    );
  });

  it('should call AddSurveyAnswer with correct values', async () => {
    const { sut, addSurveyAnswerStub } = makeSut();
    const httpRequest = mockHttpRequest();

    const addSurveyAnswerSpy = jest.spyOn(addSurveyAnswerStub, 'execute');
    await sut.handle(httpRequest);

    expect(addSurveyAnswerSpy).toBeCalledWith({
      surveyId: httpRequest.params.surveyId,
      accountId: httpRequest.accountId,
      answer: httpRequest.body.answer
    });
  });

  it('should return 500 if AddSurveyAnswer throws', async () => {
    const { sut, addSurveyAnswerStub } = makeSut();
    const httpRequest = mockHttpRequest();

    jest.spyOn(addSurveyAnswerStub, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      HttpResponseFactory.InternalServerError(new Error())
    );
  });

  it('should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpRequest = mockHttpRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(HttpResponseFactory.Ok(mockSurveyAnswer()));
  });
});
