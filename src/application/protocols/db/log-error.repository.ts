type Input = {
  stack: string;
};

type Output = void;

export namespace LogErrorRepository {
  export type Params = Input;
  export type Result = Output;
}

export interface LogErrorRepository {
  logError: (
    params: LogErrorRepository.Params
  ) => Promise<LogErrorRepository.Result>;
}
