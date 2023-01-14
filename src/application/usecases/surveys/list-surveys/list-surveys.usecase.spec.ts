import { IListSurveys, IListSurveysRepository } from './list-surveys.protocols';
import { ListSurveysUsecase } from './list-surveys.usecase';

const mockSurveys = (): IListSurveys.Result => [
  {
    id: 'any_id',
    question: 'any_question',
    date: new Date(),
    answers: [
      {
        answer: 'Answer 1',
        image: 'any_image'
      },
      {
        answer: 'Answer 2',
        image: 'any_image'
      }
    ]
  },
  {
    id: 'another_id',
    question: 'another_question',
    date: new Date(),
    answers: [
      {
        answer: 'Answer 1',
        image: 'any_image'
      },
      {
        answer: 'Answer 2',
        image: 'any_image'
      }
    ]
  }
];

const makeListSurveysRepositoryStub = (): IListSurveysRepository => {
  class ListSurveysRepositoryStub implements IListSurveysRepository {
    async list(
      data: IListSurveysRepository.Params
    ): Promise<IListSurveysRepository.Result> {
      return await new Promise((resolve) => resolve(mockSurveys()));
    }
  }

  return new ListSurveysRepositoryStub();
};

type SutTypes = {
  sut: ListSurveysUsecase;
  listSurveyRepositoryStub: IListSurveysRepository;
};

const makeSut = (): SutTypes => {
  const listSurveyRepositoryStub = makeListSurveysRepositoryStub();
  const sut = new ListSurveysUsecase({
    listSurveyRepository: listSurveyRepositoryStub
  });

  return {
    sut,
    listSurveyRepositoryStub
  };
};

describe('ListSurvey Usecase', () => {
  it('should call ListSurveysRepository', async () => {
    const { sut, listSurveyRepositoryStub } = makeSut();

    const listSurveySpy = jest.spyOn(listSurveyRepositoryStub, 'list');
    await sut.list();

    expect(listSurveySpy).toHaveBeenCalled();
  });

  it('should throw if ListSurveysRepository throws an error', async () => {
    const { sut, listSurveyRepositoryStub } = makeSut();

    jest
      .spyOn(listSurveyRepositoryStub, 'list')
      .mockRejectedValueOnce(new Error());
    const result = sut.list();

    await expect(result).rejects.toThrow();
  });

  it('should return a list of surveys on success', async () => {
    const { sut } = makeSut();

    const result = await sut.list();

    expect(result).toEqual(
      expect.arrayContaining(
        mockSurveys().map((survey) => ({
          ...survey,
          date: expect.any(Date)
        }))
      )
    );
  });
});
