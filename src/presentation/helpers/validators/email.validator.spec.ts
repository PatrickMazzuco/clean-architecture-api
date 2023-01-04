import { EmailValidator } from './email.validator';
import { InvalidParamError } from '@/presentation/errors';
import { EmailValidator as EmailValidatorService } from '@/presentation/protocols/email-validator/email-validator';

const makeEmailValidatorService = (): EmailValidatorService => {
  class EmailValidatorServiceStub implements EmailValidatorService {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorServiceStub();
};

type SutTypes = {
  sut: EmailValidator;
  emailValidatorServiceStub: EmailValidatorService;
};

const makeSut = (): SutTypes => {
  const emailValidatorServiceStub = makeEmailValidatorService();

  const sut = new EmailValidator('email', emailValidatorServiceStub);

  return {
    sut,
    emailValidatorServiceStub
  };
};

describe('Email Validator', () => {
  it('should call EmailValidatorService with correct email', async () => {
    const { sut, emailValidatorServiceStub } = makeSut();
    const params = {
      email: 'valid_email@test.com'
    };
    const isValidSpy = jest.spyOn(emailValidatorServiceStub, 'isValid');

    sut.validate(params);
    expect(isValidSpy).toHaveBeenCalledWith(params.email);
  });

  it('should return InvalidParamError if validation fails', async () => {
    const { sut, emailValidatorServiceStub } = makeSut();
    const params = {
      email: 'valid_email@test.com'
    };
    jest.spyOn(emailValidatorServiceStub, 'isValid').mockReturnValueOnce(false);

    const response = sut.validate(params);
    expect(response).toEqual(new InvalidParamError('email'));
  });

  it('should throw if EmailValidatorService throws an error', async () => {
    const { sut, emailValidatorServiceStub } = makeSut();
    const params = {
      email: 'valid_email@test.com'
    };

    jest
      .spyOn(emailValidatorServiceStub, 'isValid')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    expect(() => sut.validate(params)).toThrow();
  });
});
