import { Validator } from './validator';
import { InvalidParamError } from '@/presentation/errors';

export class CompareFieldValidator implements Validator {
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
