type Input = string;
type Output = string;

export namespace IHasher {
  export type Params = Input;
  export type Result = Output;
}

export interface IHasher {
  hash: (param: IHasher.Params) => Promise<IHasher.Result>;
}
