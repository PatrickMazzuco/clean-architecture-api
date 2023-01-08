import { EmailValidatorAdapter } from '@/infra/validators/email-validator.adapter';
import { IValidator } from '@/presentation/protocols';
import {
  CompositeValidator,
  EmailValidator,
  RequiredFieldValidator
} from '@/validation/validators';

export const makeLoginValidator = (): IValidator => {
  const validators: IValidator[] = [];
  for (const field of ['email', 'password']) {
    validators.push(new RequiredFieldValidator(field));
  }

  validators.push(new EmailValidator('email', new EmailValidatorAdapter()));

  const compositeValidator = new CompositeValidator(validators);

  return compositeValidator;
};
