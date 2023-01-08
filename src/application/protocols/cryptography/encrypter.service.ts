type Input = {
  id: string;
};

type Output = string;

export namespace IEncrypter {
  export type Params = Input;
  export type Result = Output;
}

export interface IEncrypter {
  encrypt: (params: IEncrypter.Params) => Promise<IEncrypter.Result>;
}
