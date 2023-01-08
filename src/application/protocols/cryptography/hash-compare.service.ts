type Input = {
  value: string;
  hash: string;
};

type Output = boolean;

export namespace IHashCompare {
  export type Params = Input;
  export type Result = Output;
}

export interface IHashCompare {
  compare: (params: IHashCompare.Params) => Promise<IHashCompare.Result>;
}
