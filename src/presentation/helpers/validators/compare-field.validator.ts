import { IValidator } from '../../protocols/validator';
import { InvalidParamError } from '@/presentation/errors';

export class CompareFieldValidator implements IValidator {
  constructor(
    private readonly fieldName: string,
    private readonly fieldNameToCompare: string
  ) {}

  validate(input: any): Error | null {
    if (input[this.fieldName] !== input[this.fieldNameToCompare]) {
      return new InvalidParamError(this.fieldNameToCompare);
    }
    return null;
  }
}
