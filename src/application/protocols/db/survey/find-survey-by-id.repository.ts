import { Survey } from '@/domain/entities';

type Input = string;

type Output = Survey | null;

export namespace IFindSurveyByIdRepository {
  export type Params = Input;
  export type Result = Output;
}

export interface IFindSurveyByIdRepository {
  findById: (
    id: IFindSurveyByIdRepository.Params
  ) => Promise<IFindSurveyByIdRepository.Result>;
}
