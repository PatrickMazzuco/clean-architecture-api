import { makeSignUpValidator } from './signup-validator';
import { CompareFieldValidator } from '@/presentation/helpers/validators/compare-field.validator';
import { CompositeValidator } from '@/presentation/helpers/validators/composite.validator';
import { RequiredFieldValidator } from '@/presentation/helpers/validators/required-field.validator';
import { Validator } from '@/presentation/helpers/validators/validator';

jest.mock('@/presentation/helpers/validators/composite.validator');

describe('Signup Validator', () => {
  it('should call CompositeValidator with all validators', () => {
    makeSignUpValidator();

    const validators: Validator[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validators.push(new RequiredFieldValidator(field));
    }

    validators.push(
      new CompareFieldValidator('password', 'passwordConfirmation')
    );

    expect(CompositeValidator).toHaveBeenCalledWith(validators);
  });
});
