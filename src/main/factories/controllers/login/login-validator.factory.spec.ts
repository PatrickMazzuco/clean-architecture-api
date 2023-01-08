import { makeLoginValidator } from './login-validator.factory';
import { IValidator } from '@/presentation/protocols';
import { IEmailValidator } from '@/validation/protocols/email-validator';
import { CompositeValidator } from '@/validation/validators/composite.validator';
import { EmailValidator } from '@/validation/validators/email.validator';
import { RequiredFieldValidator } from '@/validation/validators/required-field.validator';

jest.mock('@/validation/validators/composite.validator');

const makeEmailValidatorService = (): IEmailValidator => {
  class EmailValidatorServiceStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorServiceStub();
};

describe('Login Validator', () => {
  it('should call CompositeValidator with all validators', () => {
    makeLoginValidator();

    const validators: IValidator[] = [];
    for (const field of ['email', 'password']) {
      validators.push(new RequiredFieldValidator(field));
    }

    validators.push(new EmailValidator('email', makeEmailValidatorService()));

    expect(CompositeValidator).toHaveBeenCalledWith(validators);
  });
});
