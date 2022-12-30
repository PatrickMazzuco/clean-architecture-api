import validator from 'validator';

import { EmailValidatorAdapter } from './email-validator.adapter';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  }
}));

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe('Emailvalidator Adapter', () => {
  it('should return false if valdiator returns false', () => {
    const sut = makeSut();
    const email = 'invalid_email@email.com';

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    const isValid = sut.isValid(email);
    expect(isValid).toBe(false);
  });

  it('should return true if valdiator returns true', () => {
    const sut = makeSut();
    const email = 'valid_email@email.com';

    const isValid = sut.isValid(email);
    expect(isValid).toBe(true);
  });

  it('should call validator with correct email', () => {
    const sut = makeSut();
    const email = 'valid_email@email.com';

    const isEmailSpy = jest.spyOn(validator, 'isEmail');

    sut.isValid(email);
    expect(isEmailSpy).toBeCalledWith(email);
  });
});
