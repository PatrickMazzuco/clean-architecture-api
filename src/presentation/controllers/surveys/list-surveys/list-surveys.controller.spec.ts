import { ListSurveysController } from './list-surveys.controller';
import { IListSurveys } from './list-surveys.protocols';

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
  }
];

const makeListSurveys = (): IListSurveys => {
  class ListSurveysStub implements IListSurveys {
    async list(): Promise<IListSurveys.Result> {
      return await Promise.resolve(mockSurveys());
    }
  }

  return new ListSurveysStub();
};

type SutTypes = {
  sut: ListSurveysController;
  listSurveysStub: IListSurveys;
};

const makeSut = (): SutTypes => {
  const listSurveysStub = makeListSurveys();
  const sut = new ListSurveysController({
    listSurveys: listSurveysStub
  });

  return {
    sut,
    listSurveysStub
  };
};

describe('ListSurveys Controller', () => {
  it('should call ListSurveys', async () => {
    const { sut, listSurveysStub } = makeSut();

    const validatorSpy = jest.spyOn(listSurveysStub, 'list');
    await sut.handle({});

    expect(validatorSpy).toBeCalled();
  });
});
