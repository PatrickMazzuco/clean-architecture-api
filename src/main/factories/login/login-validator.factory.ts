import {
  CompositeValidator,
  EmailValidator,
  RequiredFieldValidator
} from '@/presentation/helpers/validators/';
import { Validator } from '@/presentation/protocols';
import { EmailValidatorAdapter } from '@/utils/email-validator.adapter';

export const makeLoginValidator = (): Validator => {
  const validators: Validator[] = [];
  for (const field of ['email', 'password']) {
    validators.push(new RequiredFieldValidator(field));
  }

  validators.push(new EmailValidator('email', new EmailValidatorAdapter()));

  const compositeValidator = new CompositeValidator(validators);

  return compositeValidator;
};
