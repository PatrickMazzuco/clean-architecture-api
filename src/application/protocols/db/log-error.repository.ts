type Input = {
  stack: string;
};

type Output = void;

export namespace LogErrorRepository {
  export type Params = Input;
  export type Result = Output;
}

export abstract class LogErrorRepository {
  abstract logError(
    params: LogErrorRepository.Params
  ): Promise<LogErrorRepository.Result>;
}
