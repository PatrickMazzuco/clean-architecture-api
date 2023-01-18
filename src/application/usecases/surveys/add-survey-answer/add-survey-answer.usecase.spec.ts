import {
  IAddSurveyAnswer,
  IAddSurveyAnswerRepository
} from './add-survey-answer.protocols';
import { AddSurveyAnswerUseCase } from './add-survey-answer.usecase';

const mockSurveyAnswer = (): IAddSurveyAnswer.Result => ({
  id: 'any_id',
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  date: new Date(),
  answer: 'any_answer'
});

const mockSurveyAnswerData = (): IAddSurveyAnswer.Params => {
  const { accountId, surveyId, answer } = mockSurveyAnswer();

  return {
    accountId,
    surveyId,
    answer
  };
};

const makeAddSurveyAnswerRepositoryStub = (): IAddSurveyAnswerRepository => {
  class AddSurveyAnswerRepositoryStub implements IAddSurveyAnswerRepository {
    async add(
      data: IAddSurveyAnswerRepository.Params
    ): Promise<IAddSurveyAnswerRepository.Result> {
      return await new Promise((resolve) => resolve(mockSurveyAnswer()));
    }
  }

  return new AddSurveyAnswerRepositoryStub();
};

type SutTypes = {
  sut: AddSurveyAnswerUseCase;
  addSurveyAnswerRepositoryStub: IAddSurveyAnswerRepository;
};

const makeSut = (): SutTypes => {
  const addSurveyAnswerRepositoryStub = makeAddSurveyAnswerRepositoryStub();
  const sut = new AddSurveyAnswerUseCase({
    addSurveyAnswerRepository: addSurveyAnswerRepositoryStub
  });

  return {
    sut,
    addSurveyAnswerRepositoryStub
  };
};

describe('ListSurvey Usecase', () => {
  it('should call AddSurveyAnswerRepository with correct values', async () => {
    const { sut, addSurveyAnswerRepositoryStub } = makeSut();
    const surveyAnswerData = mockSurveyAnswerData();

    const addSurveyAnswerSpy = jest.spyOn(addSurveyAnswerRepositoryStub, 'add');
    await sut.execute(surveyAnswerData);

    expect(addSurveyAnswerSpy).toHaveBeenCalledWith(
      expect.objectContaining({ ...surveyAnswerData, date: expect.any(Date) })
    );
  });

  it('should throw if AddSurveyAnswerRepository throws an error', async () => {
    const { sut, addSurveyAnswerRepositoryStub } = makeSut();
    const surveyAnswerData = mockSurveyAnswerData();

    jest
      .spyOn(addSurveyAnswerRepositoryStub, 'add')
      .mockRejectedValueOnce(new Error());
    const result = sut.execute(surveyAnswerData);

    await expect(result).rejects.toThrow();
  });

  it('should return a survey answer on success', async () => {
    const { sut } = makeSut();
    const surveyAnswerData = mockSurveyAnswerData();
    const mockedSurveyAnswer = mockSurveyAnswer();

    const surveyAnswer = await sut.execute(surveyAnswerData);

    expect(surveyAnswer).toEqual(mockedSurveyAnswer);
  });
});
