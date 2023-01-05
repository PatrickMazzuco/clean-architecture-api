import { FindAccountByEmailRepository } from '@/application/protocols/find-account-by-email.repository';
import { Authentication } from '@/domain/usecases/authentication.usecase';

export class AuthenticationUseCase implements Authentication {
  constructor(
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository
  ) {}

  async execute(
    authData: Authentication.Params
  ): Promise<Authentication.Result> {
    await this.findAccountByEmailRepository.findByEmail(authData.email);
    return { accessToken: null };
  }
}
