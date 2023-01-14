import { ListSurveysController } from './list-surveys.controller';
import { IListSurveys } from './list-surveys.protocols';
import { HttpResponseFactory } from '@/presentation/helpers/http/http.helper';

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

  it('should return 500 if ListSurveys throws', async () => {
    const { sut, listSurveysStub } = makeSut();

    jest.spyOn(listSurveysStub, 'list').mockImplementationOnce(async () => {
      return await Promise.reject(new Error());
    });

    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(
      HttpResponseFactory.InternalServerError(new Error())
    );
  });

  it('should return 200 on success', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(
      HttpResponseFactory.Ok(
        mockSurveys().map((survey) => ({ ...survey, date: expect.any(Date) }))
      )
    );
  });
});
