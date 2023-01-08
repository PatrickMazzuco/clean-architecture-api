type Input = {
  stack: string;
};

type Output = void;

export namespace ILogErrorRepository {
  export type Params = Input;
  export type Result = Output;
}

export interface ILogErrorRepository {
  logError: (
    params: ILogErrorRepository.Params
  ) => Promise<ILogErrorRepository.Result>;
}
