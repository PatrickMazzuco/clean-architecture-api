import { CompareFieldValidator } from '@/presentation/helpers/validators/compare-field.validator';
import { CompositeValidator } from '@/presentation/helpers/validators/composite.validator';
import { RequiredFieldValidator } from '@/presentation/helpers/validators/required-field.validator';
import { Validator } from '@/presentation/helpers/validators/validator';

export const makeSignUpValidator = (): Validator => {
  const validators: Validator[] = [];
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validators.push(new RequiredFieldValidator(field));
  }

  validators.push(
    new CompareFieldValidator('password', 'passwordConfirmation')
  );

  const compositeValidator = new CompositeValidator(validators);

  return compositeValidator;
};
