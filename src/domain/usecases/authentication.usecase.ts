type Input = {
  email: string;
  password: string;
};

type Output = {
  accessToken: string | null;
};

export namespace Authentication {
  export type Params = Input;
  export type Result = Output;
}

export abstract class Authentication {
  abstract execute: (
    params: Authentication.Params
  ) => Promise<Authentication.Result>;
}
