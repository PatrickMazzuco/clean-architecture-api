type Input = string;

type Output = {
  id: string;
} | null;

export namespace IDecrypter {
  export type Params = Input;
  export type Result = Output;
}

export interface IDecrypter {
  decrypt: (params: IDecrypter.Params) => Promise<IDecrypter.Result>;
}
