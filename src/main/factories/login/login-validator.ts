import { CompositeValidator } from '@/presentation/helpers/validators/composite.validator';
import { EmailValidator } from '@/presentation/helpers/validators/email.validator';
import { RequiredFieldValidator } from '@/presentation/helpers/validators/required-field.validator';
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
