import { Validator } from '../../protocols/validator';
import { InvalidParamError } from '@/presentation/errors';
import { EmailValidator as EmailValidatorService } from '@/presentation/protocols/email-validator/email-validator';

export class EmailValidator implements Validator {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidatorService
  ) {}

  validate(input: any): Error | null {
    const isEmailValid = this.emailValidator.isValid(input[this.fieldName]);
    if (!isEmailValid) {
      return new InvalidParamError('email');
    }
    return null;
  }
}
