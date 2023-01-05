import {
  CompareFieldValidator,
  CompositeValidator,
  RequiredFieldValidator,
  EmailValidator
} from '@/presentation/helpers/validators';
import { Validator } from '@/presentation/protocols';
import { EmailValidatorAdapter } from '@/utils/email-validator.adapter';

export const makeSignUpValidator = (): Validator => {
  const validators: Validator[] = [];
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validators.push(new RequiredFieldValidator(field));
  }

  validators.push(
    new CompareFieldValidator('password', 'passwordConfirmation')
  );

  validators.push(new EmailValidator('email', new EmailValidatorAdapter()));

  const compositeValidator = new CompositeValidator(validators);

  return compositeValidator;
};
