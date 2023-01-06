type Input = {
  id: string;
  accessToken: string;
};

type Output = void;

export namespace UpdateAccessTokenRepository {
  export type Params = Input;
  export type Result = Output;
}

export interface UpdateAccessTokenRepository {
  updateAccessToken: (
    params: UpdateAccessTokenRepository.Params
  ) => Promise<UpdateAccessTokenRepository.Result>;
}
