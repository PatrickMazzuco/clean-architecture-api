export const AccountRole = {
  ADMIN: 'admin',
  USER: 'user'
} as const;

export type AccountRole = typeof AccountRole[keyof typeof AccountRole];

export type Account = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AccountRole;
  accessToken?: string;
};
