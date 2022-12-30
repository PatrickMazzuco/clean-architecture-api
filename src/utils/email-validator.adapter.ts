import { EmailValidator } from '@/presentation/protocols/email-validator/email-validator';

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return false;
  }
}
