type Input = {
  id: string;
  accessToken: string;
};

type Output = void;

export namespace IUpdateAccessTokenRepository {
  export type Params = Input;
  export type Result = Output;
}

export interface IUpdateAccessTokenRepository {
  updateAccessToken: (
    params: IUpdateAccessTokenRepository.Params
  ) => Promise<IUpdateAccessTokenRepository.Result>;
}
