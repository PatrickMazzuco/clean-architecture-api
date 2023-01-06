import { makeLoginValidator } from './login-validator.factory';
import { CompositeValidator } from '@/presentation/helpers/validators/composite.validator';
import { EmailValidator } from '@/presentation/helpers/validators/email.validator';
import { RequiredFieldValidator } from '@/presentation/helpers/validators/required-field.validator';
import { Validator } from '@/presentation/protocols';
import { EmailValidator as EmailValidatorService } from '@/presentation/protocols/email-validator/email-validator';

jest.mock('@/presentation/helpers/validators/composite.validator');

const makeEmailValidatorService = (): EmailValidatorService => {
  class EmailValidatorServiceStub implements EmailValidatorService {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorServiceStub();
};

describe('Login Validator', () => {
  it('should call CompositeValidator with all validators', () => {
    makeLoginValidator();

    const validators: Validator[] = [];
    for (const field of ['email', 'password']) {
      validators.push(new RequiredFieldValidator(field));
    }

    validators.push(new EmailValidator('email', makeEmailValidatorService()));

    expect(CompositeValidator).toHaveBeenCalledWith(validators);
  });
});
