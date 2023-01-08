import { EmailValidatorAdapter } from '@/infra/validators/email-validator.adapter';
import { IValidator } from '@/presentation/protocols';
import {
  CompareFieldValidator,
  CompositeValidator,
  RequiredFieldValidator,
  EmailValidator
} from '@/validation/validators';

export const makeSignUpValidator = (): IValidator => {
  const validators: IValidator[] = [];
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
