type Input = string;
type Output = string;

export namespace Encrypter {
  export type Params = Input;
  export type Result = Output;
}

export interface Encrypter {
  encrypt: (param: Encrypter.Params) => Promise<Encrypter.Result>;
}
