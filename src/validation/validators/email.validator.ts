import { InvalidParamError } from '@/presentation/errors';
import { IValidator } from '@/presentation/protocols/validator';
import { IEmailValidator } from '@/validation/protocols/email-validator';

export class EmailValidator implements IValidator {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: IEmailValidator
  ) {}

  validate(input: any): Error | null {
    const isEmailValid = this.emailValidator.isValid(input[this.fieldName]);
    if (!isEmailValid) {
      return new InvalidParamError('email');
    }
    return null;
  }
}
