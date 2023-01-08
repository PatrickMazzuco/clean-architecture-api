type Input = {
  email: string;
  password: string;
};

type Output = {
  accessToken: string | null;
};

export namespace IAuthentication {
  export type Params = Input;
  export type Result = Output;
}

export interface IAuthentication {
  execute: (params: IAuthentication.Params) => Promise<IAuthentication.Result>;
}
