import { Validator } from '../../protocols/validator';
import { MissingParamError } from '@/presentation/errors';

export class RequiredFieldValidator implements Validator {
  constructor(private readonly fieldName: string) {}

  validate(input: any): Error | null {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
    return null;
  }
}
