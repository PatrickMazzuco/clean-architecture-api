import { CompositeValidator } from './composite.validator';
import { MissingParamError } from '@/presentation/errors';
import { IValidator } from '@/presentation/protocols/validator';

const makeValidator = (): IValidator => {
  class ValidatorStub implements IValidator {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidatorStub();
};

type SutTypes = {
  sut: CompositeValidator;
  validatorStub: IValidator;
  secondValidatorStub: IValidator;
};

const makeSut = (): SutTypes => {
  const validatorStub = makeValidator();
  const secondValidatorStub = makeValidator();
  const sut = new CompositeValidator([validatorStub, secondValidatorStub]);
  return {
    sut,
    validatorStub,
    secondValidatorStub
  };
};

describe('Composite Validator', () => {
  it('should return an error if any validator fails', () => {
    const { sut, secondValidatorStub } = makeSut();
    jest
      .spyOn(secondValidatorStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));

    const error = sut.validate({ field: 'any_value' });
    expect(error).toEqual(new MissingParamError('field'));
  });

  it('should return the first error if more than one validator fails', () => {
    const { sut, validatorStub, secondValidatorStub } = makeSut();
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Error());
    jest
      .spyOn(secondValidatorStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));

    const error = sut.validate({ field: 'any_value' });
    expect(error).toEqual(new Error());
  });

  it('should return null if all validators succeed', () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: 'any_value' });
    expect(error).toBeNull();
  });
});
