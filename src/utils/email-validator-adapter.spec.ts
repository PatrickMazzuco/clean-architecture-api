import { EmailValidatorAdapter } from './email-validator.adapter';

describe('Emailvalidator Adapter', () => {
  it('should return false if valdiator returns false', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('invalid_email@email.com');
    expect(isValid).toBe(false);
  });
});
