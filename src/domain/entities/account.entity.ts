export enum AccountRole {
  ADMIN = 'admin',
  USER = 'user'
}

export type Account = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AccountRole;
  accessToken?: string;
};
