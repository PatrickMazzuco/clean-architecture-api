type Input = {
  value: string;
  hash: string;
};

type Output = boolean;

export namespace HashCompare {
  export type Params = Input;
  export type Result = Output;
}

export interface HashCompare {
  compare: (params: HashCompare.Params) => Promise<HashCompare.Result>;
}
