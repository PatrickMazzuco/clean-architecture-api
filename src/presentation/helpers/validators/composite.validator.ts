import { Validator } from '../../protocols/validator';

export class CompositeValidator implements Validator {
  constructor(private readonly validators: Validator[]) {}

  validate(input: any): Error | null {
    for (const validator of this.validators) {
      const error = validator.validate(input);
      if (error) {
        return error;
      }
    }
    return null;
  }
}
