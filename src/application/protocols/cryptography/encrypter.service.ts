type Input = {
  id: string;
};

type Output = string;

export namespace Encrypter {
  export type Params = Input;
  export type Result = Output;
}

export interface Encrypter {
  encrypt: (params: Encrypter.Params) => Promise<Encrypter.Result>;
}
