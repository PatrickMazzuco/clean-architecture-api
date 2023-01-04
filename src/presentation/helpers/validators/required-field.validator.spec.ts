import { RequiredFieldValidator } from './required-field.validator';
import { MissingParamError } from '@/presentation/errors';

describe('RequiredField Validator', () => {
  it('should return a MissingParamError when validation fails', () => {
    const fieldName = 'field';
    const sut = new RequiredFieldValidator(fieldName);
    const param = {};
    const error = sut.validate(param);
    expect(error).toEqual(new MissingParamError(fieldName));
  });
});
