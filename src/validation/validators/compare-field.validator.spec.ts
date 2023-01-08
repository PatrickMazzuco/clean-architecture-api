import { CompareFieldValidator } from './compare-field.validator';
import { InvalidParamError } from '@/presentation/errors';

describe('CompareField Validator', () => {
  it('should return a InvalidParamError when validation fails', () => {
    const fieldName = 'field';
    const fieldNameToCompare = 'fieldToCompare';
    const sut = new CompareFieldValidator(fieldName, fieldNameToCompare);
    const param = {
      [fieldName]: 'any_value',
      [fieldNameToCompare]: 'another_value'
    };

    const error = sut.validate(param);
    expect(error).toEqual(new InvalidParamError(fieldNameToCompare));
  });

  it('should return null when validation succeeds', () => {
    const fieldName = 'field';
    const fieldNameToCompare = 'fieldToCompare';
    const sut = new CompareFieldValidator(fieldName, fieldNameToCompare);
    const param = {
      [fieldName]: 'any_value',
      [fieldNameToCompare]: 'any_value'
    };

    const result = sut.validate(param);
    expect(result).toBeNull();
  });
});
