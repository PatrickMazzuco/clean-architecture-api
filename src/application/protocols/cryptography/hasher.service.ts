type Input = string;
type Output = string;

export namespace Hasher {
  export type Params = Input;
  export type Result = Output;
}

export interface Hasher {
  hash: (param: Hasher.Params) => Promise<Hasher.Result>;
}
