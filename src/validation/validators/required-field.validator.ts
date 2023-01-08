import { MissingParamError } from '@/presentation/errors';
import { IValidator } from '@/presentation/protocols/validator';

export class RequiredFieldValidator implements IValidator {
  constructor(private readonly fieldName: string) {}

  validate(input: any): Error | null {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
    return null;
  }
}
