import {
  Survey,
  IAddSurvey,
  IAddSurveyRepository
} from './add-survey.protocols';
import { AddSurveyUsecase } from './add-survey.usecase';

const mockSurvey = (): Survey => ({
  id: 'valid_survey_id',
  question: 'valid_question',
  options: [
    {
      image: 'valid_image',
      option: 'valid_option'
    }
  ],
  date: new Date()
});

const mockSurveyData = (): IAddSurvey.Params => {
  const { question, options } = mockSurvey();
  const parsedOptions = options.map((option) => ({
    image: option.image,
    option: option.option
  }));

  return {
    question,
    options: parsedOptions,
    date: new Date()
  };
};

const makeAddSurveyRepositoryStub = (): IAddSurveyRepository => {
  class AddSurveyRepositoryStub implements IAddSurveyRepository {
    async add(
      data: IAddSurveyRepository.Params
    ): Promise<IAddSurveyRepository.Result> {
      return await new Promise((resolve) => resolve());
    }
  }

  return new AddSurveyRepositoryStub();
};

type SutTypes = {
  sut: AddSurveyUsecase;
  addSurveyRepositoryStub: IAddSurveyRepository;
};

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepositoryStub();
  const sut = new AddSurveyUsecase(addSurveyRepositoryStub);

  return {
    sut,
    addSurveyRepositoryStub
  };
};

describe('AddSurvey Usecase', () => {
  it('should call AddSurveyRepository with correct email', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const surveyData = mockSurveyData();

    const addSurveySpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    await sut.add(surveyData);

    expect(addSurveySpy).toHaveBeenCalledWith(surveyData);
  });

  it('should throw if AddSurveyRepository throws an error', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const surveyData = mockSurveyData();

    jest
      .spyOn(addSurveyRepositoryStub, 'add')
      .mockRejectedValueOnce(new Error());
    const result = sut.add(surveyData);

    await expect(result).rejects.toThrow();
  });
});
