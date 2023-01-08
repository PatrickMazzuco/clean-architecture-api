import { EmailValidatorAdapter } from '@/main/adapters/validators/email-validator.adapter';
import {
  CompositeValidator,
  EmailValidator,
  RequiredFieldValidator
} from '@/presentation/helpers/validators/';
import { IValidator } from '@/presentation/protocols';

export const makeLoginValidator = (): IValidator => {
  const validators: IValidator[] = [];
  for (const field of ['email', 'password']) {
    validators.push(new RequiredFieldValidator(field));
  }

  validators.push(new EmailValidator('email', new EmailValidatorAdapter()));

  const compositeValidator = new CompositeValidator(validators);

  return compositeValidator;
};
