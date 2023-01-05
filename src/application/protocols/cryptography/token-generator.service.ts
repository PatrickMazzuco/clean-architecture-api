type Input = {
  id: string;
};

type Output = string;

export namespace TokenGenerator {
  export type Params = Input;
  export type Result = Output;
}

export interface TokenGenerator {
  generate: (params: TokenGenerator.Params) => Promise<TokenGenerator.Result>;
}
