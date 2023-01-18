import {
  IFindSurveyById,
  IFindSurveyByIdRepository
} from './find-survey-by-id.protocols';
import { FindSurveyByIdUseCase } from './find-survey-by-id.usecase';

const MOCK_ID = 'any_id';

const mockSurvey = (): IFindSurveyById.Result => ({
  id: 'any_id',
  question: 'any_question',
  date: new Date(),
  options: [
    {
      option: 'Option 1',
      image: 'any_image'
    },
    {
      option: 'Option 2',
      image: 'any_image'
    }
  ]
});

const makeFindSurveyByIdRepositoryStub = (): IFindSurveyByIdRepository => {
  class FindSurveyByIdRepositoryStub implements IFindSurveyByIdRepository {
    async findById(
      id: IFindSurveyByIdRepository.Params
    ): Promise<IFindSurveyByIdRepository.Result> {
      return await new Promise((resolve) => resolve(mockSurvey()));
    }
  }

  return new FindSurveyByIdRepositoryStub();
};

type SutTypes = {
  sut: FindSurveyByIdUseCase;
  findSurveyByIdRepositoryStub: IFindSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
  const findSurveyByIdRepositoryStub = makeFindSurveyByIdRepositoryStub();
  const sut = new FindSurveyByIdUseCase({
    findSurveyByIdRepository: findSurveyByIdRepositoryStub
  });

  return {
    sut,
    findSurveyByIdRepositoryStub
  };
};

describe('ListSurvey Usecase', () => {
  it('should call FindSurveyByIdRepository with correct value', async () => {
    const { sut, findSurveyByIdRepositoryStub } = makeSut();

    const findSurveyByIdSpy = jest.spyOn(
      findSurveyByIdRepositoryStub,
      'findById'
    );
    await sut.execute(MOCK_ID);

    expect(findSurveyByIdSpy).toHaveBeenCalledWith(MOCK_ID);
  });

  it('should throw if FindSurveyByIdRepository throws an error', async () => {
    const { sut, findSurveyByIdRepositoryStub } = makeSut();

    jest
      .spyOn(findSurveyByIdRepositoryStub, 'findById')
      .mockRejectedValueOnce(new Error());
    const result = sut.execute(MOCK_ID);

    await expect(result).rejects.toThrow();
  });

  it('should return null when FindSurveyByIdRepository returns null', async () => {
    const { sut, findSurveyByIdRepositoryStub } = makeSut();

    jest
      .spyOn(findSurveyByIdRepositoryStub, 'findById')
      .mockResolvedValueOnce(null);
    const result = await sut.execute(MOCK_ID);

    expect(result).toBeNull();
  });

  it('should return a survey on success', async () => {
    const { sut } = makeSut();
    const survey = mockSurvey();

    const result = await sut.execute(MOCK_ID);

    expect(result).toEqual(
      expect.objectContaining({
        ...survey,
        date: expect.any(Date)
      })
    );
  });
});
