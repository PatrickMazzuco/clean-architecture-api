import { makeSignUpValidator } from './signup-validator.factory';
import { CompareFieldValidator } from '@/presentation/helpers/validators/compare-field.validator';
import { CompositeValidator } from '@/presentation/helpers/validators/composite.validator';
import { EmailValidator } from '@/presentation/helpers/validators/email.validator';
import { RequiredFieldValidator } from '@/presentation/helpers/validators/required-field.validator';
import { IValidator } from '@/presentation/protocols';
import { IEmailValidator as EmailValidatorService } from '@/presentation/protocols/email-validator/email-validator';

jest.mock('@/presentation/helpers/validators/composite.validator');

const makeEmailValidatorService = (): EmailValidatorService => {
  class EmailValidatorServiceStub implements EmailValidatorService {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorServiceStub();
};

describe('Signup Validator', () => {
  it('should call CompositeValidator with all validators', () => {
    makeSignUpValidator();

    const validators: IValidator[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validators.push(new RequiredFieldValidator(field));
    }

    validators.push(
      new CompareFieldValidator('password', 'passwordConfirmation')
    );
    validators.push(new EmailValidator('email', makeEmailValidatorService()));

    expect(CompositeValidator).toHaveBeenCalledWith(validators);
  });
});
