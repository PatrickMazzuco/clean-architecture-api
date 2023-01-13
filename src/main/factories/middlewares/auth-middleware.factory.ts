import { makeFindAccountByTokenUseCase } from '../usecases/find-account-by-token/find-account-by-token-usecase.factory';
import { AuthMiddleware } from '@/presentation/middlewares/auth/auth.middleware';
import { IMiddleware } from '@/presentation/protocols';

export const makeAuthMiddleware = (role?: string): IMiddleware => {
  const findAccountByTokenUsecase = makeFindAccountByTokenUseCase();
  const middleware = new AuthMiddleware({
    findAccountByToken: findAccountByTokenUsecase,
    role
  });

  return middleware;
};
